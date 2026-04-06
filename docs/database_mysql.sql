-- MySQL 8+ schema for "Timeline Todo" (Lyubishchev time tracking)
-- Charset/Collation: utf8mb4 / utf8mb4_unicode_ci
-- IDs: BINARY(16) UUID (Hibernate maps java.util.UUID to BINARY(16) on MySQL)

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =========================
-- Core: Users / Devices
-- =========================

CREATE TABLE IF NOT EXISTS app_user (
  id BINARY(16) NOT NULL,
  email VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  password_hash VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  display_name VARCHAR(255) COLLATE utf8mb4_unicode_ci NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uk_app_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS device (
  id BINARY(16) NOT NULL,
  user_id BINARY(16) NOT NULL,
  name VARCHAR(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  platform VARCHAR(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  last_seen_at DATETIME(6) NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_device_user_id (user_id),
  CONSTRAINT fk_device_user FOREIGN KEY (user_id) REFERENCES app_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =========================
-- Taxonomy: Categories / Tags
-- =========================

CREATE TABLE IF NOT EXISTS category (
  id BINARY(16) NOT NULL,
  user_id BINARY(16) NOT NULL,
  name VARCHAR(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  color VARCHAR(16) COLLATE utf8mb4_unicode_ci NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uk_category_user_name (user_id, name),
  KEY idx_category_user_id (user_id),
  CONSTRAINT fk_category_user FOREIGN KEY (user_id) REFERENCES app_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tag (
  id BINARY(16) NOT NULL,
  user_id BINARY(16) NOT NULL,
  name VARCHAR(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  color VARCHAR(16) COLLATE utf8mb4_unicode_ci NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uk_tag_user_name (user_id, name),
  KEY idx_tag_user_id (user_id),
  CONSTRAINT fk_tag_user FOREIGN KEY (user_id) REFERENCES app_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =========================
-- Tasks / Time Entries
-- =========================

CREATE TABLE IF NOT EXISTS task (
  id BINARY(16) NOT NULL,
  user_id BINARY(16) NOT NULL,
  title VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  status ENUM('RUNNING','PAUSED','DONE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'RUNNING',
  category_id BINARY(16) NULL,
  start_time DATETIME(6) NOT NULL,
  end_time DATETIME(6) NULL,
  note TEXT COLLATE utf8mb4_unicode_ci NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  deleted_at DATETIME(6) NULL,
  PRIMARY KEY (id),
  KEY idx_task_user_start (user_id, start_time),
  KEY idx_task_user_status (user_id, status),
  KEY idx_task_category_id (category_id),
  CONSTRAINT fk_task_user FOREIGN KEY (user_id) REFERENCES app_user(id),
  CONSTRAINT fk_task_category FOREIGN KEY (category_id) REFERENCES category(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS task_tag (
  task_id BINARY(16) NOT NULL,
  tag_id BINARY(16) NOT NULL,
  PRIMARY KEY (task_id, tag_id),
  KEY idx_task_tag_tag_id (tag_id),
  CONSTRAINT fk_task_tag_task FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE,
  CONSTRAINT fk_task_tag_tag FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Time entry (a.k.a. time block)
CREATE TABLE IF NOT EXISTS time_entry (
  id BINARY(16) NOT NULL,
  user_id BINARY(16) NOT NULL,
  task_id BINARY(16) NULL,
  category_id BINARY(16) NULL,
  source ENUM('AUTO','MANUAL') COLLATE utf8mb4_unicode_ci NULL,
  nature ENUM('POSITIVE','NEUTRAL','NEGATIVE') COLLATE utf8mb4_unicode_ci NULL,
  start_time DATETIME(6) NOT NULL,
  end_time DATETIME(6) NULL,
  duration_minutes INT NOT NULL,
  note TEXT COLLATE utf8mb4_unicode_ci NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  deleted_at DATETIME(6) NULL,
  PRIMARY KEY (id),
  KEY idx_time_entry_user_start (user_id, start_time),
  KEY idx_time_entry_task_id (task_id),
  KEY idx_time_entry_category_id (category_id),
  CONSTRAINT fk_time_entry_user FOREIGN KEY (user_id) REFERENCES app_user(id),
  CONSTRAINT fk_time_entry_task FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE SET NULL,
  CONSTRAINT fk_time_entry_category FOREIGN KEY (category_id) REFERENCES category(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS time_entry_tag (
  time_entry_id BINARY(16) NOT NULL,
  tag_id BINARY(16) NOT NULL,
  PRIMARY KEY (time_entry_id, tag_id),
  KEY idx_time_entry_tag_tag_id (tag_id),
  CONSTRAINT fk_time_entry_tag_entry FOREIGN KEY (time_entry_id) REFERENCES time_entry(id) ON DELETE CASCADE,
  CONSTRAINT fk_time_entry_tag_tag FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =========================
-- Daily Review / Reports
-- =========================

CREATE TABLE IF NOT EXISTS daily_review (
  id BINARY(16) NOT NULL,
  user_id BINARY(16) NOT NULL,
  day DATE NOT NULL,
  stats_json JSON NOT NULL,
  suggestion_text VARCHAR(512) COLLATE utf8mb4_unicode_ci NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uk_daily_review_user_day (user_id, day),
  KEY idx_daily_review_user_day (user_id, day),
  CONSTRAINT fk_daily_review_user FOREIGN KEY (user_id) REFERENCES app_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =========================
-- Sync: Change Log (offline merge)
-- =========================

-- Minimal conflict-resolution approach:
-- - Each client device writes a monotonically increasing client_seq.
-- - Server stores operations and applies "last write wins" (LWW) by occurred_at, but can be upgraded later.
CREATE TABLE IF NOT EXISTS sync_change (
  id BINARY(16) NOT NULL,
  user_id BINARY(16) NOT NULL,
  device_id BINARY(16) NOT NULL,
  entity_type VARCHAR(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  entity_id BINARY(16) NOT NULL,
  op ENUM('UPSERT','DELETE') COLLATE utf8mb4_unicode_ci NOT NULL,
  client_seq BIGINT NOT NULL,
  occurred_at DATETIME(6) NOT NULL,
  payload_json JSON NULL,
  server_received_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uk_sync_change_device_seq (device_id, client_seq),
  KEY idx_sync_change_user_time (user_id, occurred_at),
  KEY idx_sync_change_entity (entity_type, entity_id),
  CONSTRAINT fk_sync_change_user FOREIGN KEY (user_id) REFERENCES app_user(id),
  CONSTRAINT fk_sync_change_device FOREIGN KEY (device_id) REFERENCES device(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;
