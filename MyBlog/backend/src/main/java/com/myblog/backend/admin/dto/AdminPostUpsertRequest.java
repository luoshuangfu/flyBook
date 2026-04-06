package com.myblog.backend.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record AdminPostUpsertRequest(
        @NotBlank @Size(max = 200) String title,
        @NotBlank @Size(max = 200) String slug,
        @NotBlank @Size(max = 500) String summary,
        @NotBlank String contentMarkdown,
        String coverUrl,
        @NotBlank String categorySlug,
        @NotNull Set<String> tagSlugs,
        @NotBlank String status
) {}
