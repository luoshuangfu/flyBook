# MyBlog（可落实版本）

一个**前后端分离**的个人博客系统：发布 Markdown 技术笔记 + 展示项目作品集 + 集成飞书云文档（“我的一天”）。

本仓库里 `MyBlog/` 已经包含了可运行的前后端与可选管理端；本 README 只描述与需求文档相关的落地方式，避免引入额外功能。

## 目录结构（以 `MyBlog/` 为根）

- `backend/`: 用户端 API（Spring Boot 3 / Java 17 / JPA / Spring Security / Swagger）
- `fronted/`: 用户端前台（React + Vite + react-markdown）
- 管理端已整合到 `fronted/` 的同一套 React 项目中（`/admin/*`）。

> 说明：`fronted` 为历史命名（拼写如此），为减少无关改动，本次不重命名目录。

## 功能与接口对齐（用户端）

对应你文档中的接口示例，`backend/` 已实现：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/posts` | GET | 获取笔记列表（支持 `category` / `tag` 筛选） |
| `/api/posts/{idOrSlug}` | GET | 获取单篇笔记内容（支持 id 或 slug） |
| `/api/categories` | GET | 获取所有分类 |
| `/api/tags` | GET | 获取所有标签 |
| `/api/projects` | GET | 获取项目列表 |
| `/api/feishu/day` | GET | 获取飞书“我的一天”内容（无配置时自动走 mock） |

## 前端页面结构对齐（用户端）

`fronted/` 已实现页面与路由：

| 页面 | 路由 |
|------|------|
| 首页（笔记列表 + 侧栏分类/标签/项目入口） | `/` |
| 笔记详情页（Markdown 渲染） | `/posts/:idOrSlug` |
| 项目展示页（卡片列表） | `/projects` |
| “我的一天”页（表格展示） | `/my-day` |

管理端（已整合在同一套 React 前端中）：

| 页面 | 路由 |
|------|------|
| 登录 | `/admin/login` |
| 新建文章（简单编辑器） | `/admin/posts` |

## UI 风格约束（手绘暖色）

用户端前台样式位于 `fronted/src/styles/`：

- `theme.css`: 暖色调变量（米黄/奶油/淡橙）与手绘字体栈
- `app.css`: 手绘边框、阴影、圆角、响应式布局

本实现未使用蓝紫色渐变；背景为暖色径向纹理 + 米黄色底色。

## 本地启动（推荐：先用 H2 + mock 飞书跑通）

### 1) 启动后端（用户端 API）

在 `MyBlog/backend/`：

```bash
mvn spring-boot:run
```

默认使用内存 H2（MySQL 模式）并 `ddl-auto:update`，适合快速启动。

启动后：

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

### 2) 启动前端（用户端）

在 `MyBlog/fronted/`：

```bash
npm install
npm run dev
```

前端通过 `VITE_API_BASE_URL` 指向后端（见 `.env.example`）。

## 使用 MySQL/Redis 与飞书真实接口（可选）

### 后端环境变量（`backend/.env.example`）

- `DB_URL` / `DB_USERNAME` / `DB_PASSWORD`: 切换到 MySQL
- `REDIS_HOST` / `REDIS_PORT`: Redis（可选）
- `FEISHU_ENABLED=true` + `FEISHU_APP_ID` / `FEISHU_APP_SECRET` / `FEISHU_DOCUMENT_ID`: 启用飞书

### 飞书“我的一天”的行为

- **未配置或 `FEISHU_ENABLED=false`**：后端返回 `backend/src/main/resources/mock/feishu-day.json` 的 mock 数据
- **配置完整且启用**：后端会走真实的 tenant_access_token 获取与 docx raw 拉取路径（同时仍会返回规范化结构，便于前端稳定渲染）

> 原来的独立管理端已不再作为主方案；管理端功能请以 `fronted/` 路由 `/admin/*` 为准。

# Blog Portfolio Starter

该目录是“手绘风个人博客与作品集”的起步骨架。

## 建议启动顺序
1. 先初始化后端 Spring Boot 项目（Java 17, Spring Web, JPA, Security）
2. 导入 `docs/blog-portfolio-design/database.sql`
3. 初始化前端 React + Vite + Tailwind
4. 先对接文章列表、详情、项目列表、我的一天（mock）
5. 最后切换真实飞书 API

## 参考文档
- `../docs/blog-portfolio-design/README.md`
- `../docs/blog-portfolio-design/api-spec.md`
- `../docs/blog-portfolio-design/feishu-integration.md`
