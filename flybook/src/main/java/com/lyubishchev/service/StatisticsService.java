package com.lyubishchev.service;

import com.lyubishchev.dto.StatisticsDTO;
import com.lyubishchev.entity.TimeRecord;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class StatisticsService {

    private final RecordService recordService;

    public StatisticsService(RecordService recordService) {
        this.recordService = recordService;
    }

    public List<StatisticsDTO> getDailyStatistics(LocalDate date) {
        var records = recordService.getByDate(date);
        Map<String, Long> sum = new LinkedHashMap<>();

        records.forEach(record -> sum.merge(record.getCategoryName(), (long) record.getDurationMinutes(), Long::sum));

        return sum.entrySet().stream()
                .map(e -> StatisticsDTO.builder().categoryName(e.getKey()).totalMinutes(e.getValue()).build())
                .toList();
    }

    public List<StatisticsDTO> getRangeStatistics(LocalDate startDate, LocalDate endDate) {
        var records = recordService.getByDateRange(startDate, endDate);
        Map<String, Long> sum = new LinkedHashMap<>();

        records.forEach(record -> sum.merge(record.getCategoryName(), (long) record.getDurationMinutes(), Long::sum));

        return sum.entrySet().stream()
                .map(e -> StatisticsDTO.builder().categoryName(e.getKey()).totalMinutes(e.getValue()).build())
                .toList();
    }
}
