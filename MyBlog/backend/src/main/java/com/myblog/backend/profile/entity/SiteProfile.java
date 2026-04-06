package com.myblog.backend.profile.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "site_profile")
@Getter
@Setter
public class SiteProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 32)
    private String avatarText = "";

    @Column(nullable = false, length = 120)
    private String siteName = "";

    @Column(nullable = false, length = 64)
    private String name = "";

    @Column(nullable = false, length = 500)
    private String bio = "";

    private LocalDate birthday;

    @Column(nullable = false, length = 300)
    private String github = "";

    @Column(nullable = false, length = 120)
    private String email = "";

    @Column(nullable = false, length = 120)
    private String location = "";

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "site_profile_skill", joinColumns = @JoinColumn(name = "profile_id"))
    @OrderColumn(name = "sort_no")
    @Column(name = "skill_name", nullable = false, length = 64)
    private List<String> skills = new ArrayList<>();

    @Column(nullable = false)
    private boolean showAvatar = true;

    @Column(nullable = false)
    private boolean showName = true;

    @Column(nullable = false)
    private boolean showBio = true;

    @Column(nullable = false)
    private boolean showBirthday = true;

    @Column(nullable = false)
    private boolean showGithub = true;

    @Column(nullable = false)
    private boolean showEmail = true;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
