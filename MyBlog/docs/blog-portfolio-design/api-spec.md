# API 设计

## 公共响应
```json
{
  "code": 0,
  "message": "OK",
  "data": {}
}
```

## 博客接口
- `GET /api/posts?category=java&tag=spring&page=1&pageSize=10`
- `GET /api/posts/{idOrSlug}`
- `GET /api/categories`
- `GET /api/tags`

## 项目接口
- `GET /api/projects`

## 飞书接口
- `GET /api/feishu/day`

返回示例：
```json
{
  "code": 0,
  "message": "OK",
  "data": {
    "source": "feishu",
    "documentTitle": "我的一天",
    "items": [
      {"time": "11:53", "activity": "搭建工作流", "duration": "-"},
      {"time": "12:02", "activity": "刷网页/资讯", "duration": "20分钟"}
    ],
    "updatedAt": "2026-03-25T10:00:00Z"
  }
}
```

## 后台接口
- `POST /api/admin/auth/login`
- `POST /api/admin/posts`
- `PUT /api/admin/posts/{id}`
- `DELETE /api/admin/posts/{id}`
- `POST /api/admin/projects`
- `PUT /api/admin/projects/{id}`
- `DELETE /api/admin/projects/{id}`

## 状态码约定
- 200：成功
- 400：参数错误
- 401：未登录或 token 失效
- 403：无权限
- 404：资源不存在
- 500：服务异常
