package com.timeline.todo.repo;

import com.timeline.todo.model.TimeBlock;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeBlockRepository extends JpaRepository<TimeBlock, UUID> {
  List<TimeBlock> findByTaskId(UUID taskId);
}
