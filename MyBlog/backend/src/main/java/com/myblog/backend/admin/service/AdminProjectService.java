package com.myblog.backend.admin.service;

import com.myblog.backend.admin.dto.AdminProjectUpsertRequest;
import com.myblog.backend.common.BizException;
import com.myblog.backend.project.entity.PortfolioProject;
import com.myblog.backend.project.repo.PortfolioProjectRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminProjectService {

    private final PortfolioProjectRepository repository;

    public AdminProjectService(PortfolioProjectRepository repository) {
        this.repository = repository;
    }

    public Long create(AdminProjectUpsertRequest request) {
        PortfolioProject project = new PortfolioProject();
        apply(project, request);
        return repository.save(project).getId();
    }

    public void update(Long id, AdminProjectUpsertRequest request) {
        PortfolioProject project = repository.findById(id).orElseThrow(() -> new BizException("项目不存在"));
        apply(project, request);
        repository.save(project);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new BizException("项目不存在");
        }
        repository.deleteById(id);
    }

    private void apply(PortfolioProject project, AdminProjectUpsertRequest request) {
        project.setName(request.name());
        project.setDescription(request.description());
        project.setTechStack(request.techStack());
        project.setGithubUrl(request.githubUrl());
        project.setDemoUrl(request.demoUrl());
        project.setSortNo(request.sortNo() == null ? 0 : request.sortNo());
    }
}
