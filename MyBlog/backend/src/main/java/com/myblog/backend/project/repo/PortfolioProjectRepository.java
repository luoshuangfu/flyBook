package com.myblog.backend.project.repo;

import com.myblog.backend.project.entity.PortfolioProject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PortfolioProjectRepository extends JpaRepository<PortfolioProject, Long> {
    List<PortfolioProject> findAllByOrderBySortNoAscIdDesc();
}
