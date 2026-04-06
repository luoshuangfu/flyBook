package com.timeline.todo.controller;

import com.timeline.todo.model.Task;
import com.timeline.todo.model.User;
import com.timeline.todo.repo.UserRepository;
import com.timeline.todo.service.TaskService;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
  private final TaskService taskService;
  private final UserRepository userRepository;

  public TaskController(TaskService taskService, UserRepository userRepository) {
    this.taskService = taskService;
    this.userRepository = userRepository;
  }

  @GetMapping
  public List<Task> list(@RequestHeader("X-User-Id") UUID userId) {
    return taskService.listByUser(userId);
  }

  @PostMapping
  public Task create(
    @RequestHeader("X-User-Id") UUID userId,
    @RequestBody CreateTaskRequest request
  ) {
    User user = userRepository.findById(userId).orElseThrow();
    String category = request.category();
    if (category == null || category.isBlank()) {
      category = inferCategory(request.title());
    }
    return taskService.createTask(user, request.title(), category);
  }

  @PatchMapping("/{taskId}/pause")
  public Task pause(@PathVariable UUID taskId) {
    return taskService.pauseTask(taskId);
  }

  @PatchMapping("/{taskId}/complete")
  public Task complete(@PathVariable UUID taskId) {
    return taskService.completeTask(taskId);
  }

  private String inferCategory(String title) {
    String lower = title.toLowerCase(Locale.ROOT);
    if (lower.contains("学习") || lower.contains("study") || lower.contains("论文")) return "学习";
    if (lower.contains("开发") || lower.contains("需求") || lower.contains("work")) return "工作";
    if (lower.contains("通勤") || lower.contains("metro") || lower.contains("公交")) return "通勤";
    if (lower.contains("运动") || lower.contains("run") || lower.contains("gym")) return "运动";
    if (lower.contains("休息") || lower.contains("sleep")) return "休息";
    return "生活";
  }

  public record CreateTaskRequest(@NotBlank String title, String category) {}
}
