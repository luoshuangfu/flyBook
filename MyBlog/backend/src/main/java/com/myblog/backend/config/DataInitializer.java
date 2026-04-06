package com.myblog.backend.config;

import com.myblog.backend.admin.entity.AdminUser;
import com.myblog.backend.admin.repo.AdminUserRepository;
import com.myblog.backend.post.entity.Category;
import com.myblog.backend.post.entity.CategoryStatus;
import com.myblog.backend.post.entity.Post;
import com.myblog.backend.post.entity.PostStatus;
import com.myblog.backend.post.entity.Tag;
import com.myblog.backend.post.repo.CategoryRepository;
import com.myblog.backend.post.repo.PostRepository;
import com.myblog.backend.post.repo.TagRepository;
import com.myblog.backend.profile.entity.SiteProfile;
import com.myblog.backend.profile.repo.SiteProfileRepository;
import com.myblog.backend.project.entity.PortfolioProject;
import com.myblog.backend.project.repo.PortfolioProjectRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(CategoryRepository categoryRepository,
                               TagRepository tagRepository,
                               PostRepository postRepository,
                               SiteProfileRepository siteProfileRepository,
                               PortfolioProjectRepository projectRepository,
                               AdminUserRepository adminUserRepository,
                               PasswordEncoder passwordEncoder) {
        return args -> {
            if (categoryRepository.count() == 0) {
                Category java = new Category();
                java.setName("Java");
                java.setSlug("java");
                java.setDescription("Java、Spring 以及后端工程化相关文章");
                java.setStatus(CategoryStatus.ENABLED);
                categoryRepository.save(java);

                Category frontend = new Category();
                frontend.setName("前端");
                frontend.setSlug("frontend");
                frontend.setDescription("前端框架、工程化与交互体验相关文章");
                frontend.setStatus(CategoryStatus.ENABLED);
                categoryRepository.save(frontend);

                Tag spring = new Tag();
                spring.setName("Spring Boot");
                spring.setSlug("spring-boot");
                spring.setColor("#7ea172");
                spring.setDescription("Spring Boot 相关实践与踩坑总结");
                tagRepository.save(spring);

                Tag react = new Tag();
                react.setName("React");
                react.setSlug("react");
                react.setColor("#5c8ddb");
                react.setDescription("React 组件设计与页面开发");
                tagRepository.save(react);

                Post post1 = new Post();
                post1.setTitle("手绘风博客系统拆解");
                post1.setSlug("hand-drawn-blog-architecture");
                post1.setSummary("从信息结构、接口分层到 UI 视觉语言，拆解一个可落地的个人博客系统。");
                post1.setContentMarkdown("# 手绘风博客系统\n\n这是一篇示例文章，支持 **Markdown** 渲染。\n\n- 架构\n- API\n- UI\n");
                post1.setCategory(java);
                post1.setTags(Set.of(spring));
                post1.setStatus(PostStatus.PUBLISHED);
                post1.setPublishedAt(LocalDateTime.now().minusDays(1));
                postRepository.save(post1);

                Post post2 = new Post();
                post2.setTitle("React 页面结构与组件拆分");
                post2.setSlug("react-page-structure");
                post2.setSummary("首页、详情页、项目页、我的一天页的拆分思路与复用组件建议。");
                post2.setContentMarkdown("# React 页面结构\n\n建议先按页面划分目录，再抽离公共组件。\n");
                post2.setCategory(frontend);
                post2.setTags(Set.of(react));
                post2.setStatus(PostStatus.PUBLISHED);
                post2.setPublishedAt(LocalDateTime.now().minusHours(4));
                postRepository.save(post2);
            }

            if (siteProfileRepository.count() == 0) {
                SiteProfile profile = new SiteProfile();
                profile.setAvatarText("博主");
                profile.setSiteName("手绘风个人博客");
                profile.setName("手绘风博主");
                profile.setBio("记录技术笔记、项目沉淀和生活观察。");
                profile.setBirthday(LocalDate.of(1998, 6, 18));
                profile.setGithub("https://github.com/example");
                profile.setEmail("you@example.com");
                profile.setLocation("上海");
                profile.setSkills(new ArrayList<>(List.of("React", "Spring Boot", "写作")));
                profile.setShowAvatar(true);
                profile.setShowName(true);
                profile.setShowBio(true);
                profile.setShowBirthday(true);
                profile.setShowGithub(true);
                profile.setShowEmail(true);
                siteProfileRepository.save(profile);
            }

            if (projectRepository.count() == 0) {
                PortfolioProject p1 = new PortfolioProject();
                p1.setName("手绘风博客");
                p1.setDescription("支持 Markdown、分类标签与飞书日程接入的博客系统。");
                p1.setTechStack("React, Spring Boot, MySQL");
                p1.setGithubUrl("https://github.com/example/hand-drawn-blog");
                p1.setDemoUrl("https://demo.example.com");
                p1.setSortNo(1);
                projectRepository.save(p1);

                PortfolioProject p2 = new PortfolioProject();
                p2.setName("番茄钟工作台");
                p2.setDescription("一个极简任务计时工具，支持时间线复盘。");
                p2.setTechStack("Vue, TypeScript, IndexedDB");
                p2.setGithubUrl("https://github.com/example/pomodoro-board");
                p2.setSortNo(2);
                projectRepository.save(p2);
            }

            if (adminUserRepository.count() == 0) {
                AdminUser admin = new AdminUser();
                admin.setUsername("admin");
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                admin.setEnabled(true);
                adminUserRepository.save(admin);
            }
        };
    }
}
