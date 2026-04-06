# 手绘风个人博客与作品集（项目设计）

## 1. 项目目标
构建一个前后端分离的个人博客系统，覆盖：
- 博客笔记（Markdown）发布与展示
- 项目作品集展示
- 飞书“我的一天”文档读取与可视化
- 后台登录与内容管理

## 2. 技术选型（最终建议）
### 后端
- Java 17
- Spring Boot 3.3+
- Spring Data JPA（若更熟悉 MyBatis-Plus，可平替）
- Spring Security + JWT
- MySQL 8（默认）
- Redis（可选：token 黑名单、热点缓存）
- OpenFeign/RestTemplate + 飞书开放 API
- MapStruct + Lombok
- springdoc-openapi（或 Knife4j）

### 前端
- React + TypeScript + Vite
- TailwindCSS + 自定义手绘主题变量
- React Router
- Axios
- Markdown：remark + rehype（支持扩展能力更好）

## 3. 目录建议
详见 `scaffold-tree.md`。

## 4. 核心业务模块
- 博客模块：文章、分类、标签、筛选、详情页
- 项目模块：项目卡片列表
- 飞书模块：读取固定 docx 并转换为时间线数据
- 管理模块：登录、文章 CRUD

## 5. 非功能要求
- 页面首屏 < 2.5s（CDN+懒加载）
- SEO：文章详情 SSR 可作为后续增强项
- 安全：JWT + 接口鉴权 + 管理接口限流
- 可维护：DTO/VO 分层、统一异常、审计字段

## 6. 开发里程碑
- M1：公共框架 + 文章列表/详情 + mock 飞书
- M2：后台管理 + 分类标签管理
- M3：真实飞书接入 + 缓存 + 部署上线
