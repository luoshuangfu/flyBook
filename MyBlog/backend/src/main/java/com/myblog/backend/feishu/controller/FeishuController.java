package com.myblog.backend.feishu.controller;

import com.myblog.backend.common.ApiResponse;
import com.myblog.backend.feishu.dto.DayTimelineResponse;
import com.myblog.backend.feishu.service.FeishuDayService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/feishu")
public class FeishuController {

    private final FeishuDayService feishuDayService;

    public FeishuController(FeishuDayService feishuDayService) {
        this.feishuDayService = feishuDayService;
    }

    @GetMapping("/day")
    public ApiResponse<DayTimelineResponse> getMyDay() {
        return ApiResponse.ok(feishuDayService.getMyDay());
    }
}
