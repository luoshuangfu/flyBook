package com.timeline.todo.service;

import com.timeline.todo.model.Task;
import com.timeline.todo.model.TaskStatus;
import com.timeline.todo.model.TimeBlock;
import com.timeline.todo.model.TimeBlockNature;
import com.timeline.todo.model.TimeBlockSource;
import com.timeline.todo.model.User;
import com.timeline.todo.repo.TaskRepository;
import com.timeline.todo.repo.TimeBlockRepository;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService {
  private final TaskRepository taskRepository;
  private final TimeBlockRepository timeBlockRepository;

  public TaskService(TaskRepository taskRepository, TimeBlockRepository timeBlockRepository) {
    this.taskRepository = taskRepository;
    this.timeBlockRepository = timeBlockRepository;
  }

  public List<Task> listByUser(UUID userId) {
    return taskRepository.findByUserId(userId);
  }

  @Transactional
  public Task createTask(User user, String title, String category) {
    Task task = new Task();
    task.setUser(user);
    task.setTitle(title);
    task.setCategory(category);
    task.setStatus(TaskStatus.RUNNING);
    task.setStartTime(Instant.now());
    return taskRepository.save(task);
  }

  @Transactional
  public Task pauseTask(UUID taskId) {
    Task task = taskRepository.findById(taskId).orElseThrow();
    task.setStatus(TaskStatus.PAUSED);
    task.setEndTime(Instant.now());
    Task saved = taskRepository.save(task);
    saveTimeBlock(saved);
    return saved;
  }

  @Transactional
  public Task completeTask(UUID taskId) {
    Task task = taskRepository.findById(taskId).orElseThrow();
    task.setStatus(TaskStatus.DONE);
    task.setEndTime(Instant.now());
    Task saved = taskRepository.save(task);
    saveTimeBlock(saved);
    return saved;
  }

  private void saveTimeBlock(Task task) {
    if (task.getEndTime() == null) {
      return;
    }
    TimeBlock block = new TimeBlock();
    block.setTask(task);
    block.setStartTime(task.getStartTime());
    block.setEndTime(task.getEndTime());
    block.setCategory(task.getCategory());
    block.setSource(TimeBlockSource.AUTO);
    block.setNature(TimeBlockNature.NEUTRAL);
    long minutes = Math.max(1, Duration.between(task.getStartTime(), task.getEndTime()).toMinutes());
    block.setDurationMinutes((int) minutes);
    timeBlockRepository.save(block);
  }
}


