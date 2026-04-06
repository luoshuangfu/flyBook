package com.myblog.backend.post.repo;

import com.myblog.backend.post.entity.Post;
import com.myblog.backend.post.entity.PostStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    Optional<Post> findBySlug(String slug);

    List<Post> findByStatusOrderByPublishedAtDesc(PostStatus status);

    List<Post> findByStatusAndCategory_SlugOrderByPublishedAtDesc(PostStatus status, String categorySlug);

    List<Post> findByStatusAndTags_SlugOrderByPublishedAtDesc(PostStatus status, String tagSlug);

    List<Post> findByStatusAndCategory_SlugAndTags_SlugOrderByPublishedAtDesc(PostStatus status, String categorySlug, String tagSlug);
}
