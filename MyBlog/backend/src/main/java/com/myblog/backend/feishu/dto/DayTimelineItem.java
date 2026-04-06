package com.myblog.backend.feishu.dto;

public record DayTimelineItem(
        String time,
        String activity,
        String duration
) {}
