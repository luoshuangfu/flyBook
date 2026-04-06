package com.lyubishchev.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecordRequestDTO {

    @NotBlank(message = "活动名称不能为空")
    private String activityName;

    @NotNull(message = "分类ID不能为空")
    private Integer categoryId;

    @NotNull(message = "开始时间不能为空")
    private LocalDateTime startTime;

    @NotNull(message = "结束时间不能为空")
    private LocalDateTime endTime;
}
