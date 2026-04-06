package com.myblog.backend.project.controller;

import com.myblog.backend.common.ApiResponse;
import com.myblog.backend.project.dto.ProjectResponse;
import com.myblog.backend.project.service.ProjectQueryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectQueryService projectQueryService;

    public ProjectController(ProjectQueryService projectQueryService) {
        this.projectQueryService = projectQueryService;
    }

    @GetMapping
    public ApiResponse<List<ProjectResponse>> listProjects() {
        return ApiResponse.ok(projectQueryService.listProjects());
    }
}
