# 数据库设计（MySQL 8）

## 实体关系
- `post` N:1 `category`
- `post` N:M `tag`（中间表 `post_tag`）
- `site_profile` 1:N `site_profile_skill`
- `project` 独立实体
- `admin_user` 后台管理员

## 建表 SQL
详见 `database.sql`。

## 字段约束
- 所有表包含：`created_at`、`updated_at`
- `post.slug` 唯一，用于 SEO URL
- `tag.name`、`category.name` 唯一
- `post.status`：`DRAFT` / `PUBLISHED`
- `category.status`：`ENABLED` / `DISABLED`
- `tag.color` 用于后台标签色卡与前台标签视觉
- `site_profile` 对应后台“个人信息管理”表单

## 索引建议
- `post(status, published_at desc)`：文章列表
- `post(category_id)`：按分类筛选
- `post_tag(tag_id, post_id)`：按标签筛选
- `category(status)`：前台只展示启用分类
