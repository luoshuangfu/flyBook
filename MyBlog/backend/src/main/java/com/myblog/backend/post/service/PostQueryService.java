package com.myblog.backend.post.service;

import com.myblog.backend.common.BizException;
import com.myblog.backend.post.dto.LabelValueResponse;
import com.myblog.backend.post.dto.PostDetailResponse;
import com.myblog.backend.post.dto.PostListItemResponse;
import com.myblog.backend.post.entity.CategoryStatus;
import com.myblog.backend.post.entity.Post;
import com.myblog.backend.post.entity.PostStatus;
import com.myblog.backend.post.repo.CategoryRepository;
import com.myblog.backend.post.repo.PostRepository;
import com.myblog.backend.post.repo.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class PostQueryService {

    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    public PostQueryService(PostRepository postRepository, CategoryRepository categoryRepository, TagRepository tagRepository) {
        this.postRepository = postRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
    }

    public List<PostListItemResponse> listPosts(String category, String tag) {
        List<Post> posts;
        if (StringUtils.hasText(category) && StringUtils.hasText(tag)) {
            posts = postRepository.findByStatusAndCategory_SlugAndTags_SlugOrderByPublishedAtDesc(PostStatus.PUBLISHED, category, tag);
        } else if (StringUtils.hasText(category)) {
            posts = postRepository.findByStatusAndCategory_SlugOrderByPublishedAtDesc(PostStatus.PUBLISHED, category);
        } else if (StringUtils.hasText(tag)) {
            posts = postRepository.findByStatusAndTags_SlugOrderByPublishedAtDesc(PostStatus.PUBLISHED, tag);
        } else {
            posts = postRepository.findByStatusOrderByPublishedAtDesc(PostStatus.PUBLISHED);
        }
        return posts.stream().map(this::toListItem).toList();
    }

    public PostDetailResponse getPost(String idOrSlug) {
        Post post;
        try {
            Long id = Long.parseLong(idOrSlug);
            post = postRepository.findById(id).orElseThrow(() -> new BizException("Post not found"));
        } catch (NumberFormatException ex) {
            post = postRepository.findBySlug(idOrSlug).orElseThrow(() -> new BizException("Post not found"));
        }
        if (post.getStatus() != PostStatus.PUBLISHED) {
            throw new BizException("Post not found");
        }
        return new PostDetailResponse(
                post.getId(),
                post.getTitle(),
                post.getSlug(),
                post.getSummary(),
                post.getContentMarkdown(),
                post.getCoverUrl(),
                post.getCategory().getName(),
                post.getTags().stream().map(tag -> tag.getName()).sorted().toList(),
                post.getPublishedAt()
        );
    }

    public List<LabelValueResponse> listCategories() {
        return categoryRepository.findAll().stream()
                .filter(category -> category.getStatus() == CategoryStatus.ENABLED)
                .map(c -> new LabelValueResponse(c.getId(), c.getName(), c.getSlug()))
                .sorted((a, b) -> a.name().compareToIgnoreCase(b.name()))
                .toList();
    }

    public List<LabelValueResponse> listTags() {
        return tagRepository.findAll().stream()
                .map(t -> new LabelValueResponse(t.getId(), t.getName(), t.getSlug()))
                .sorted((a, b) -> a.name().compareToIgnoreCase(b.name()))
                .toList();
    }

    private PostListItemResponse toListItem(Post post) {
        return new PostListItemResponse(
                post.getId(),
                post.getTitle(),
                post.getSlug(),
                post.getSummary(),
                post.getCoverUrl(),
                post.getCategory().getName(),
                post.getTags().stream().map(tag -> tag.getName()).sorted().toList(),
                post.getPublishedAt()
        );
    }
}
