package com.lyubishchev.controller;

import com.lyubishchev.dto.RecordRequestDTO;
import com.lyubishchev.dto.RecordResponseDTO;
import com.lyubishchev.dto.StatisticsDTO;
import com.lyubishchev.service.RecordService;
import com.lyubishchev.service.StatisticsService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
public class RecordController {

    private final RecordService recordService;
    private final StatisticsService statisticsService;

    @GetMapping
    public List<RecordResponseDTO> getByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return recordService.getByDate(date);
    }

    @GetMapping("/range")
    public List<RecordResponseDTO> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return recordService.getByDateRange(startDate, endDate);
    }

    @PostMapping
    public RecordResponseDTO create(@Valid @RequestBody RecordRequestDTO requestDTO) {
        return recordService.create(requestDTO);
    }

    @PutMapping("/{id}")
    public RecordResponseDTO update(@PathVariable Integer id, @Valid @RequestBody RecordRequestDTO requestDTO) {
        return recordService.update(id, requestDTO);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        recordService.delete(id);
    }

    @GetMapping("/statistics/daily")
    public List<StatisticsDTO> dailyStats(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return statisticsService.getDailyStatistics(date);
    }

    @GetMapping("/statistics/range")
    public List<StatisticsDTO> rangeStats(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return statisticsService.getRangeStatistics(startDate, endDate);
    }
}
