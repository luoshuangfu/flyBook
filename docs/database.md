# 数据库设计（MySQL 8）

当前后端（Spring Boot + JPA）已经在 MySQL 上运行，并自动生成了 `app_user` / `task` / `time_block` 三张表。
为了满足完整需求（多设备同步、用户自定义分类与标签、时间块统计、每日复盘），建议升级为下面这套更规范、可扩展的结构。

## 设计原则
- 所有业务数据按 `user_id` 隔离（多租户方式）。
- 统一使用 `BINARY(16)` 存 UUID 主键（与 Hibernate 在 MySQL 的默认映射一致）。
- 时间统一用 `DATETIME(6)`（毫秒级），便于时间轴与统计。
- 标签/分类用独立表，避免把 tags 拼成字符串导致查询困难。
- 同步采用“变更日志”表 `sync_change`，支持离线编辑与冲突处理。

## 核心表
- `app_user`: 用户。
- `device`: 设备表，用于多端同步。
- `category`: 用户自定义分类（如 学习/工作/生活），可挂颜色、排序。
- `tag`: 用户自定义标签。
- `task`: 任务（支持状态、分类、软删除）。
- `task_tag`: 任务与标签多对多。
- `time_entry`: 时间块（支持与 task 关联或独立存在）。
- `time_entry_tag`: 时间块与标签多对多。
- `daily_review`: 每日复盘结果（统计 JSON + 建议文案）。
- `sync_change`: 同步变更日志（device + client_seq 去重）。

## 现有表的差异提醒
- 你现在库里已有的 `time_block.task_id` 是 NOT NULL，但代码里 `TimeBlock.task` 设为可空；
  新设计里的 `time_entry.task_id` 改为可空（更符合“记录行踪不一定对应任务”的场景）。

## DDL
- DDL 已放在：`G:\codexThread\项目\docs\database_mysql.sql`
- 这份 DDL 是“目标结构”，和当前 Hibernate 自动生成的结构不完全一致，落地时建议走迁移（Flyway/Liquibase）而不是继续 `ddl-auto:update`。
