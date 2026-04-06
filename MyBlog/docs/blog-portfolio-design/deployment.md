# 部署与环境变量

## 后端 .env.example
```env
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8080
DB_URL=jdbc:mysql://127.0.0.1:3306/blog_portfolio?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
DB_USERNAME=root
DB_PASSWORD=123456
JWT_SECRET=replace_with_very_long_random_secret
JWT_EXPIRE_SECONDS=86400
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
FEISHU_ENABLED=false
FEISHU_APP_ID=
FEISHU_APP_SECRET=
FEISHU_DOCUMENT_ID=
```

## 前端 .env.example
```env
VITE_API_BASE_URL=http://localhost:8080
```

## 部署建议
- 前端：Vercel / Netlify
- 后端：Render / Railway / 云主机 Docker
- 数据库：MySQL 托管服务
- Redis：按需开启（并非 MVP 强依赖）

## Docker 建议
- 后端单独镜像
- Nginx 反向代理 `/api` 到后端
- 配置 CORS 与 HTTPS
