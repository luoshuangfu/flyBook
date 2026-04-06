# 系统架构设计

## 架构概览
- 前端（React）负责页面渲染、路由、样式和 API 调用。
- 后端（Spring Boot）提供 REST API、鉴权、业务逻辑和数据持久化。
- MySQL 存储业务数据。
- Redis 缓存热点数据与临时 token 状态。
- 飞书 Open API 由后端代理调用，前端不直连飞书。

## 分层设计（后端）
- `controller`：入参校验、出参包装
- `service`：业务编排
- `repository`：数据访问
- `integration.feishu`：飞书客户端与响应转换
- `security`：JWT 鉴权
- `common`：异常、统一响应、工具类

## 前端分层
- `pages`：页面级组件（Home/PostDetail/Projects/Day/Admin）
- `components`：可复用组件（PostCard/TagCloud/TimelineTable）
- `api`：Axios 实例与 API 方法
- `store`：状态管理（轻量可用 Zustand）
- `styles`：主题变量、全局样式

## 关键流程
1. 用户访问首页 -> `GET /api/posts` + `GET /api/categories` + `GET /api/tags`
2. 进入详情页 -> `GET /api/posts/{id}`，后端返回 markdown 字段
3. 访问“我的一天” -> 前端调 `GET /api/feishu/day`，后端从飞书拉取并标准化
4. 管理员登录 -> `POST /api/admin/auth/login` 获取 JWT -> 调用管理端 CRUD

## 缓存策略
- `posts:list:*`：列表页缓存 60s
- `post:detail:{id}`：详情缓存 5min
- `feishu:day:{documentId}`：30s~120s（避免频繁调用飞书）

## 安全策略
- 白名单：`/api/posts/**`、`/api/projects/**`、`/api/feishu/day`
- 管理接口：`/api/admin/**` 必须 JWT
- 密码：BCrypt
- CORS：只允许前端域名
