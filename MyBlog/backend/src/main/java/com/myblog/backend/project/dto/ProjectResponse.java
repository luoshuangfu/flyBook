package com.myblog.backend.project.dto;

public record ProjectResponse(
        Long id,
        String name,
        String description,
        String techStack,
        String githubUrl,
        String demoUrl
) {}
