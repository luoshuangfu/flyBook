# 柳比歇夫时间轴 TODO（MVP 骨架）

## 目录结构
- frontend: React + TypeScript 主视图（时间轴、语音输入、手绘风格）
- backend: Spring Boot + PostgreSQL 后端（任务/时间块/同步骨架）

## 本地启动（需要自行安装依赖）

### 前端
```bash
cd frontend
npm install
npm run dev
```

### 后端
```bash
cd backend
mvn spring-boot:run
```

### 数据库
创建数据库与账号（示例）：
```sql
CREATE DATABASE timeline_todo;
CREATE USER todo WITH PASSWORD 'todo';
GRANT ALL PRIVILEGES ON DATABASE timeline_todo TO todo;
```

> 可在 `backend/src/main/resources/application.yml` 修改连接信息。

## 说明
- 当前版本已实现：垂直时间轴、15 分钟块、语音/手动输入、任务计时、基础 REST API、WebSocket 同步骨架。
- 认证目前为占位实现（返回随机 token）；后续可替换为 JWT/OAuth2。
- 复盘模块提供了定时任务与统计入口，图表与建议文案需按产品策略迭代。
