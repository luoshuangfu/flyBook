package com.timeline.todo.service;

import com.timeline.todo.model.Task;
import com.timeline.todo.repo.TaskRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class SummaryService {
  private final TaskRepository taskRepository;

  public SummaryService(TaskRepository taskRepository) {
    this.taskRepository = taskRepository;
  }

  public Map<String, Long> buildDailyCategoryMinutes(UUID userId, LocalDate date) {
    Instant start = date.atStartOfDay(ZoneId.systemDefault()).toInstant();
    Instant end = date.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
    List<Task> tasks = taskRepository.findByUserIdAndStartTimeBetween(userId, start, end);

    return tasks.stream()
      .filter(task -> task.getEndTime() != null)
      .collect(Collectors.groupingBy(
        Task::getCategory,
        Collectors.summingLong(task ->
          Math.max(1, java.time.Duration.between(task.getStartTime(), task.getEndTime()).toMinutes())
        )
      ));
  }

  @Scheduled(cron = "0 0 23 * * *")
  public void nightlySummaryJob() {
    // TODO: 获取所有用户并生成复盘报告，这里只保留任务骨架。
    // 可与通知服务/报表存储结合。
  }
}
