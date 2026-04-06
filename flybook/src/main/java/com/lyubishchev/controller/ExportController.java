package com.lyubishchev.controller;

import com.lyubishchev.dto.RecordResponseDTO;
import com.lyubishchev.service.RecordService;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
public class ExportController {

    private final RecordService recordService;

    @GetMapping
    public ResponseEntity<byte[]> exportCsv(
            @RequestParam(defaultValue = "csv") String format,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        if (!"csv".equalsIgnoreCase(format)) {
            return ResponseEntity.badRequest().body("Only csv format is supported".getBytes(StandardCharsets.UTF_8));
        }

        List<RecordResponseDTO> records = recordService.getByDate(date);

        StringBuilder csv = new StringBuilder();
        csv.append("ID,活动名称,分类,开始时间,结束时间,时长(分钟),记录日期\n");

        records.forEach(r -> csv.append(r.getId()).append(',')
                .append(escape(r.getActivityName())).append(',')
                .append(escape(r.getCategoryName())).append(',')
                .append(r.getStartTime()).append(',')
                .append(r.getEndTime()).append(',')
                .append(r.getDurationMinutes()).append(',')
                .append(r.getRecordDate()).append('\n'));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=records-" + date + ".csv")
                .contentType(new MediaType("text", "csv", StandardCharsets.UTF_8))
                .body(csv.toString().getBytes(StandardCharsets.UTF_8));
    }

    private String escape(String v) {
        if (v == null) {
            return "";
        }
        return "\"" + v.replace("\"", "\"\"") + "\"";
    }
}
