# MyBlog Frontend（用户端）

React + Vite 的用户端前台：笔记列表/详情（Markdown）、项目展示、“我的一天”（飞书）。

## 环境准备

- Node.js 18+（建议）

## 启动

```bash
npm install
npm run dev
```

## 配置

复制 `.env.example` 为 `.env.local`（或直接在终端设置环境变量）：

- `VITE_API_BASE_URL`: 后端 API 基地址（默认 `http://localhost:8080`）

## 路由

- `/`: 首页（笔记列表 + 分类/标签侧栏）
- `/posts/:idOrSlug`: 笔记详情（Markdown 渲染）
- `/projects`: 项目展示
- `/my-day`: 我的一天（表格/时间线）

可选后台页（用于最小管理闭环）：

- `/admin/login`: 登录
- `/admin/posts`: 新建文章

