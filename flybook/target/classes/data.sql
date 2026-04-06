INSERT IGNORE INTO category (name) VALUES
('核心工作'),
('行政事务'),
('学习研究'),
('休息'),
('交通'),
('生活杂务');

-- 今天（CURDATE）示例记录
INSERT INTO time_record (activity_name, category_id, start_time, end_time, duration_minutes, record_date)
SELECT '晨间计划', c.id, TIMESTAMP(CURDATE(), '09:00:00'), TIMESTAMP(CURDATE(), '09:20:00'), 20, CURDATE()
FROM category c
WHERE c.name = '核心工作'
  AND NOT EXISTS (
    SELECT 1
    FROM time_record t
    WHERE t.activity_name = '晨间计划'
      AND t.start_time = TIMESTAMP(CURDATE(), '09:00:00')
  );

INSERT INTO time_record (activity_name, category_id, start_time, end_time, duration_minutes, record_date)
SELECT '需求整理', c.id, TIMESTAMP(CURDATE(), '09:30:00'), TIMESTAMP(CURDATE(), '11:00:00'), 90, CURDATE()
FROM category c
WHERE c.name = '核心工作'
  AND NOT EXISTS (
    SELECT 1
    FROM time_record t
    WHERE t.activity_name = '需求整理'
      AND t.start_time = TIMESTAMP(CURDATE(), '09:30:00')
  );

INSERT INTO time_record (activity_name, category_id, start_time, end_time, duration_minutes, record_date)
SELECT '文档归档', c.id, TIMESTAMP(CURDATE(), '11:10:00'), TIMESTAMP(CURDATE(), '11:40:00'), 30, CURDATE()
FROM category c
WHERE c.name = '行政事务'
  AND NOT EXISTS (
    SELECT 1
    FROM time_record t
    WHERE t.activity_name = '文档归档'
      AND t.start_time = TIMESTAMP(CURDATE(), '11:10:00')
  );

INSERT INTO time_record (activity_name, category_id, start_time, end_time, duration_minutes, record_date)
SELECT '技术阅读', c.id, TIMESTAMP(CURDATE(), '14:00:00'), TIMESTAMP(CURDATE(), '15:00:00'), 60, CURDATE()
FROM category c
WHERE c.name = '学习研究'
  AND NOT EXISTS (
    SELECT 1
    FROM time_record t
    WHERE t.activity_name = '技术阅读'
      AND t.start_time = TIMESTAMP(CURDATE(), '14:00:00')
  );

INSERT INTO time_record (activity_name, category_id, start_time, end_time, duration_minutes, record_date)
SELECT '晚间复盘', c.id, TIMESTAMP(CURDATE(), '20:30:00'), TIMESTAMP(CURDATE(), '21:00:00'), 30, CURDATE()
FROM category c
WHERE c.name = '核心工作'
  AND NOT EXISTS (
    SELECT 1
    FROM time_record t
    WHERE t.activity_name = '晚间复盘'
      AND t.start_time = TIMESTAMP(CURDATE(), '20:30:00')
  );

-- 昨天（CURDATE - 1 day）示例记录
INSERT INTO time_record (activity_name, category_id, start_time, end_time, duration_minutes, record_date)
SELECT '通勤', c.id,
       TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 DAY), '08:20:00'),
       TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 DAY), '08:50:00'),
       30,
       DATE_SUB(CURDATE(), INTERVAL 1 DAY)
FROM category c
WHERE c.name = '交通'
  AND NOT EXISTS (
    SELECT 1
    FROM time_record t
    WHERE t.activity_name = '通勤'
      AND t.start_time = TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 DAY), '08:20:00')
  );

INSERT INTO time_record (activity_name, category_id, start_time, end_time, duration_minutes, record_date)
SELECT '接口联调', c.id,
       TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 DAY), '10:00:00'),
       TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 DAY), '12:00:00'),
       120,
       DATE_SUB(CURDATE(), INTERVAL 1 DAY)
FROM category c
WHERE c.name = '核心工作'
  AND NOT EXISTS (
    SELECT 1
    FROM time_record t
    WHERE t.activity_name = '接口联调'
      AND t.start_time = TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 DAY), '10:00:00')
  );

INSERT INTO time_record (activity_name, category_id, start_time, end_time, duration_minutes, record_date)
SELECT '午休', c.id,
       TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 DAY), '12:20:00'),
       TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 DAY), '13:00:00'),
       40,
       DATE_SUB(CURDATE(), INTERVAL 1 DAY)
FROM category c
WHERE c.name = '休息'
  AND NOT EXISTS (
    SELECT 1
    FROM time_record t
    WHERE t.activity_name = '午休'
      AND t.start_time = TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 DAY), '12:20:00')
  );
