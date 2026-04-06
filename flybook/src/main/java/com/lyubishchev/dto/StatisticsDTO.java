package com.lyubishchev.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class StatisticsDTO {
    private String categoryName;
    private Long totalMinutes;
}
