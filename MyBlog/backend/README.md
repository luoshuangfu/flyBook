# MyBlog Backend（用户端 API）

Spring Boot 3 / Java 17 / JPA / Spring Security / Swagger。

本服务提供用户端 API（文章/分类/标签/项目/飞书“我的一天”），并包含最小可用的管理端接口（`/api/admin/*`）。

## 启动

```bash
mvn spring-boot:run
```

默认会使用内存 H2（MySQL 模式）快速启动。

## API 文档

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

## 主要接口

- `GET /api/posts?category={slug}&tag={slug}`
- `GET /api/posts/{idOrSlug}`
- `GET /api/categories`
- `GET /api/tags`
- `GET /api/projects`
- `GET /api/feishu/day`

管理端（可选）：

- `POST /api/admin/auth/login`
- `POST /api/admin/posts`
- `POST /api/admin/projects`

## 配置（环境变量）

参考 `.env.example`：

- 数据库：`DB_URL` / `DB_USERNAME` / `DB_PASSWORD`
- JWT：`JWT_SECRET` / `JWT_EXPIRE_SECONDS`
- Redis（可选）：`REDIS_HOST` / `REDIS_PORT`
- 飞书（可选）：`FEISHU_ENABLED` / `FEISHU_APP_ID` / `FEISHU_APP_SECRET` / `FEISHU_DOCUMENT_ID`

## 飞书“我的一天”

当飞书未启用或配置不完整时，会返回 mock 数据：

- `src/main/resources/mock/feishu-day.json`

当飞书启用且配置齐全时，会走 tenant_access_token 与 docx raw 拉取路径，同时返回前端可直接渲染的规范结构。

