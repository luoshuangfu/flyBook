package com.lyubishchev.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RecordResponseDTO {
    private Integer id;
    private String activityName;
    private Integer categoryId;
    private String categoryName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer durationMinutes;
    private LocalDate recordDate;
}
