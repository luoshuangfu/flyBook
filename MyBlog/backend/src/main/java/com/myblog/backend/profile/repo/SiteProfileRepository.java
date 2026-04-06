package com.myblog.backend.profile.repo;

import com.myblog.backend.profile.entity.SiteProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteProfileRepository extends JpaRepository<SiteProfile, Long> {
}
