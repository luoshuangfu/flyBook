package com.timeline.todo.ws;

import java.time.Instant;
import java.util.UUID;

public record SyncMessage(
  UUID userId,
  String entity,
  UUID entityId,
  String action,
  Instant occurredAt
) {}
