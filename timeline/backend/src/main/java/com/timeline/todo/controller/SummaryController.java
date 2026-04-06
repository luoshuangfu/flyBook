package com.timeline.todo.controller;

import com.timeline.todo.service.SummaryService;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/summary")
public class SummaryController {
  private final SummaryService summaryService;

  public SummaryController(SummaryService summaryService) {
    this.summaryService = summaryService;
  }

  @GetMapping("/daily")
  public Map<String, Long> daily(
    @RequestHeader("X-User-Id") UUID userId,
    @RequestParam(required = false) String date
  ) {
    LocalDate target = date == null ? LocalDate.now() : LocalDate.parse(date);
    return summaryService.buildDailyCategoryMinutes(userId, target);
  }
}
