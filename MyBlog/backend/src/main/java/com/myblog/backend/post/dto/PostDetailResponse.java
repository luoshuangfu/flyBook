package com.myblog.backend.post.dto;

import java.time.LocalDateTime;
import java.util.List;

public record PostDetailResponse(
        Long id,
        String title,
        String slug,
        String summary,
        String contentMarkdown,
        String coverUrl,
        String category,
        List<String> tags,
        LocalDateTime publishedAt
) {}
