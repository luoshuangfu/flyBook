package com.myblog.backend.feishu.dto;

import java.time.LocalDateTime;
import java.util.List;

public record DayTimelineResponse(
        String source,
        String documentTitle,
        List<DayTimelineItem> items,
        LocalDateTime updatedAt
) {}
