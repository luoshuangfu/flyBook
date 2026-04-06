package com.myblog.backend.project.service;

import com.myblog.backend.project.dto.ProjectResponse;
import com.myblog.backend.project.repo.PortfolioProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectQueryService {

    private final PortfolioProjectRepository repository;

    public ProjectQueryService(PortfolioProjectRepository repository) {
        this.repository = repository;
    }

    public List<ProjectResponse> listProjects() {
        return repository.findAllByOrderBySortNoAscIdDesc().stream()
                .map(item -> new ProjectResponse(
                        item.getId(),
                        item.getName(),
                        item.getDescription(),
                        item.getTechStack(),
                        item.getGithubUrl(),
                        item.getDemoUrl()
                ))
                .toList();
    }
}
