package com.myblog.backend.admin.service;

import com.myblog.backend.admin.dto.AdminPostUpsertRequest;
import com.myblog.backend.common.BizException;
import com.myblog.backend.post.entity.Category;
import com.myblog.backend.post.entity.Post;
import com.myblog.backend.post.entity.PostStatus;
import com.myblog.backend.post.entity.Tag;
import com.myblog.backend.post.repo.CategoryRepository;
import com.myblog.backend.post.repo.PostRepository;
import com.myblog.backend.post.repo.TagRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Service
public class AdminPostService {

    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    public AdminPostService(PostRepository postRepository, CategoryRepository categoryRepository, TagRepository tagRepository) {
        this.postRepository = postRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
    }

    public Long create(AdminPostUpsertRequest request) {
        Post post = new Post();
        apply(post, request);
        return postRepository.save(post).getId();
    }

    public void update(Long id, AdminPostUpsertRequest request) {
        Post post = postRepository.findById(id).orElseThrow(() -> new BizException("文章不存在"));
        apply(post, request);
        postRepository.save(post);
    }

    public void delete(Long id) {
        if (!postRepository.existsById(id)) {
            throw new BizException("文章不存在");
        }
        postRepository.deleteById(id);
    }

    private void apply(Post post, AdminPostUpsertRequest request) {
        Category category = categoryRepository.findBySlug(request.categorySlug())
                .orElseThrow(() -> new BizException("分类不存在"));
        Set<Tag> tags = new HashSet<>(tagRepository.findAll().stream()
                .filter(tag -> request.tagSlugs().contains(tag.getSlug()))
                .toList());
        if (tags.size() != request.tagSlugs().size()) {
            throw new BizException("标签不存在");
        }

        PostStatus status = PostStatus.valueOf(request.status().toUpperCase());
        post.setTitle(request.title());
        post.setSlug(request.slug());
        post.setSummary(request.summary());
        post.setContentMarkdown(request.contentMarkdown());
        post.setCoverUrl(request.coverUrl());
        post.setCategory(category);
        post.setTags(tags);
        post.setStatus(status);
        if (status == PostStatus.PUBLISHED && post.getPublishedAt() == null) {
            post.setPublishedAt(LocalDateTime.now());
        }
        if (status == PostStatus.DRAFT) {
            post.setPublishedAt(null);
        }
    }
}
