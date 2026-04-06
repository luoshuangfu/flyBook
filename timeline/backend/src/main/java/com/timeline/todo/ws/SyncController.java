package com.timeline.todo.ws;

import java.time.Instant;
import java.util.UUID;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class SyncController {
  @MessageMapping("/sync")
  @SendTo("/topic/sync")
  public SyncMessage sync(SyncMessage message) {
    return new SyncMessage(
      message.userId(),
      message.entity(),
      message.entityId() == null ? UUID.randomUUID() : message.entityId(),
      message.action(),
      message.occurredAt() == null ? Instant.now() : message.occurredAt()
    );
  }
}
