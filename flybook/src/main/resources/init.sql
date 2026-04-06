-- 一键初始化脚本（MySQL 8.x）
-- 用法：mysql -u root -p < init.sql

CREATE DATABASE IF NOT EXISTS lyubishchev
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE lyubishchev;

CREATE TABLE IF NOT EXISTS category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS time_record (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_name VARCHAR(100) NOT NULL,
    category_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    duration_minutes INT NOT NULL,
    record_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_time_record_category FOREIGN KEY (category_id) REFERENCES category(id)
);

INSERT IGNORE INTO category (name) VALUES
('核心工作'),
('行政事务'),
('学习研究'),
('休息'),
('交通'),
('生活杂务');
