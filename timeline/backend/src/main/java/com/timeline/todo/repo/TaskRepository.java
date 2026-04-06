package com.timeline.todo.repo;

import com.timeline.todo.model.Task;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, UUID> {
  List<Task> findByUserId(UUID userId);
  List<Task> findByUserIdAndStartTimeBetween(UUID userId, Instant start, Instant end);
}
