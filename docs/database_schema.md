# 数据库表结构（MySQL 8 / utf8mb4）

约定：
- 主键：`id BINARY(16)`（UUID）
- 
- 时间：`DATETIME(6)`（毫秒）
- 默认字符集/排序规则：`utf8mb4 / utf8mb4_unicode_ci`

## app_user（用户）
| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | BINARY(16) | PK | 用户 ID（UUID） |
| email | VARCHAR(255) | NOT NULL, UNIQUE | 登录邮箱 |
| password_hash | VARCHAR(255) | NOT NULL | 密码哈希 |
| display_name | VARCHAR(255) | NULL | 显示名 |
| created_at | DATETIME(6) | NOT NULL | 创建时间 |
| updated_at | DATETIME(6) | NOT NULL | 更新时间（自动更新） |

<-- 缺了简介，要补充>

索引：

- `uk_app_user_email (email)`

## device（设备）
| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | BINARY(16) | PK | 设备 ID |
| user_id | BINARY(16) | NOT NULL, FK | 归属用户 |
| name | VARCHAR(120) | NOT NULL | 设备名称 |
| platform | VARCHAR(40) | NOT NULL | 平台（iOS/Android/Windows/macOS/Web 等） |
| last_seen_at | DATETIME(6) | NULL | 最近活跃 |
| created_at | DATETIME(6) | NOT NULL | 创建时间 |

索引/外键：
- `idx_device_user_id (user_id)`
- `fk_device_user (user_id -> app_user.id)`

## category（分类）
| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | BINARY(16) | PK | 分类 ID |
| user_id | BINARY(16) | NOT NULL, FK | 归属用户 |
| name | VARCHAR(60) | NOT NULL | 分类名（学习/工作/生活等） |
| color | VARCHAR(16) | NULL | 颜色（可选） |
| sort_order | INT | NOT NULL | 排序权重 |
| created_at | DATETIME(6) | NOT NULL | 创建时间 |
| updated_at | DATETIME(6) | NOT NULL | 更新时间（自动更新） |

索引/约束：
- `uk_category_user_name (user_id, name)`（同一用户下分类名唯一）
- `idx_category_user_id (user_id)`
- `fk_category_user (user_id -> app_user.id)`

## tag（标签）
| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | BINARY(16) | PK | 标签 ID |
| user_id | BINARY(16) | NOT NULL, FK | 归属用户 |
| name | VARCHAR(60) | NOT NULL | 标签名 |
| color | VARCHAR(16) | NULL | 颜色（可选） |
| created_at | DATETIME(6) | NOT NULL | 创建时间 |

索引/约束：
- `uk_tag_user_name (user_id, name)`
- `idx_tag_user_id (user_id)`
- `fk_tag_user (user_id -> app_user.id)`

## task（任务）
| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | BINARY(16) | PK | 任务 ID |
| user_id | BINARY(16) | NOT NULL, FK | 归属用户 |
| title | VARCHAR(255) | NOT NULL | 任务标题 |
| status | ENUM | NOT NULL | `RUNNING/PAUSED/DONE` |
| category_id | BINARY(16) | NULL, FK | 分类（可选） |
| start_time | DATETIME(6) | NOT NULL | 开始时间 |
| end_time | DATETIME(6) | NULL | 结束时间 |
| note | TEXT | NULL | 备注 |
| created_at | DATETIME(6) | NOT NULL | 创建时间 |
| updated_at | DATETIME(6) | NOT NULL | 更新时间（自动更新） |
| deleted_at | DATETIME(6) | NULL | 软删除时间 |

索引/外键：
- `idx_task_user_start (user_id, start_time)`
- `idx_task_user_status (user_id, status)`
- `idx_task_category_id (category_id)`
- `fk_task_user (user_id -> app_user.id)`
- `fk_task_category (category_id -> category.id)`

## task_tag（任务-标签关联）
| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| task_id | BINARY(16) | PK, FK | 任务 ID |
| tag_id | BINARY(16) | PK, FK | 标签 ID |

索引/外键：
- `idx_task_tag_tag_id (tag_id)`
- `fk_task_tag_task (task_id -> task.id)`（ON DELETE CASCADE）
- `fk_task_tag_tag (tag_id -> tag.id)`（ON DELETE CASCADE）

## time_entry（时间块/时间记录）
说明：既可关联到 `task`，也可独立存在（更贴近“行踪记录”）。

| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | BINARY(16) | PK | 时间块 ID |
| user_id | BINARY(16) | NOT NULL, FK | 归属用户 |
| task_id | BINARY(16) | NULL, FK | 关联任务（可选） |
| category_id | BINARY(16) | NULL, FK | 分类（可选） |
| source | ENUM | NULL | `AUTO/MANUAL` |
| nature | ENUM | NULL | `POSITIVE/NEUTRAL/NEGATIVE` |
| start_time | DATETIME(6) | NOT NULL | 开始时间 |
| end_time | DATETIME(6) | NULL | 结束时间 |
| duration_minutes | INT | NOT NULL | 分钟数（冗余字段，便于统计） |
| note | TEXT | NULL | 备注 |
| created_at | DATETIME(6) | NOT NULL | 创建时间 |
| updated_at | DATETIME(6) | NOT NULL | 更新时间（自动更新） |
| deleted_at | DATETIME(6) | NULL | 软删除时间 |

索引/外键：
- `idx_time_entry_user_start (user_id, start_time)`
- `idx_time_entry_task_id (task_id)`
- `idx_time_entry_category_id (category_id)`
- `fk_time_entry_user (user_id -> app_user.id)`
- `fk_time_entry_task (task_id -> task.id)`（ON DELETE SET NULL）
- `fk_time_entry_category (category_id -> category.id)`

## time_entry_tag（时间块-标签关联）
| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| time_entry_id | BINARY(16) | PK, FK | 时间块 ID |
| tag_id | BINARY(16) | PK, FK | 标签 ID |

索引/外键：
- `idx_time_entry_tag_tag_id (tag_id)`
- `fk_time_entry_tag_entry (time_entry_id -> time_entry.id)`（ON DELETE CASCADE）
- `fk_time_entry_tag_tag (tag_id -> tag.id)`（ON DELETE CASCADE）

## daily_review（每日复盘）
| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | BINARY(16) | PK | 复盘 ID |
| user_id | BINARY(16) | NOT NULL, FK | 归属用户 |
| day | DATE | NOT NULL | 日期（唯一） |
| stats_json | JSON | NOT NULL | 统计结果（分类/时段/完成率等） |
| suggestion_text | VARCHAR(512) | NULL | 一句话建议 |
| created_at | DATETIME(6) | NOT NULL | 创建时间 |

索引/约束：
- `uk_daily_review_user_day (user_id, day)`
- `idx_daily_review_user_day (user_id, day)`
- `fk_daily_review_user (user_id -> app_user.id)`

## sync_change（同步变更日志）
说明：用于多设备离线编辑合并。通过 `(device_id, client_seq)` 去重，按 `occurred_at` 回放或合并。

| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | BINARY(16) | PK | 变更 ID |
| user_id | BINARY(16) | NOT NULL, FK | 归属用户 |
| device_id | BINARY(16) | NOT NULL, FK | 来源设备 |
| entity_type | VARCHAR(40) | NOT NULL | 实体类型（task/time_entry/category/tag 等） |
| entity_id | BINARY(16) | NOT NULL | 实体 ID |
| op | ENUM | NOT NULL | `UPSERT/DELETE` |
| client_seq | BIGINT | NOT NULL | 设备内自增序号 |
| occurred_at | DATETIME(6) | NOT NULL | 客户端发生时间 |
| payload_json | JSON | NULL | 变更载荷 |
| server_received_at | DATETIME(6) | NOT NULL | 服务端接收时间 |

索引/约束：
- `uk_sync_change_device_seq (device_id, client_seq)`
- `idx_sync_change_user_time (user_id, occurred_at)`
- `idx_sync_change_entity (entity_type, entity_id)`
- `fk_sync_change_user (user_id -> app_user.id)`
- `fk_sync_change_device (device_id -> device.id)`