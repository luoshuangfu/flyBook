package com.myblog.backend.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminProjectUpsertRequest(
        @NotBlank @Size(max = 120) String name,
        @NotBlank @Size(max = 500) String description,
        @NotBlank @Size(max = 300) String techStack,
        String githubUrl,
        String demoUrl,
        Integer sortNo
) {}
