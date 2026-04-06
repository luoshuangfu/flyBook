package com.lyubishchev.service;

import com.lyubishchev.dto.RecordRequestDTO;
import com.lyubishchev.dto.RecordResponseDTO;
import com.lyubishchev.entity.Category;
import com.lyubishchev.entity.TimeRecord;
import com.lyubishchev.repository.CategoryRepository;
import com.lyubishchev.repository.RecordRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class RecordService {

    private final RecordRepository recordRepository;
    private final CategoryRepository categoryRepository;

    public List<RecordResponseDTO> getByDate(LocalDate date) {
        return recordRepository.findByRecordDateOrderByStartTimeAsc(date)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<RecordResponseDTO> getByDateRange(LocalDate startDate, LocalDate endDate) {
        return recordRepository.findByRecordDateBetweenOrderByStartTimeAsc(startDate, endDate)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public RecordResponseDTO create(RecordRequestDTO dto) {
        Category category = fetchCategory(dto.getCategoryId());
        validateTimeRange(dto);

        TimeRecord record = TimeRecord.builder()
                .activityName(dto.getActivityName())
                .category(category)
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .durationMinutes((int) Duration.between(dto.getStartTime(), dto.getEndTime()).toMinutes())
                .recordDate(dto.getStartTime().toLocalDate())
                .build();

        return mapToResponse(recordRepository.save(record));
    }

    public RecordResponseDTO update(Integer id, RecordRequestDTO dto) {
        TimeRecord existing = recordRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("记录不存在"));

        Category category = fetchCategory(dto.getCategoryId());
        validateTimeRange(dto);

        existing.setActivityName(dto.getActivityName());
        existing.setCategory(category);
        existing.setStartTime(dto.getStartTime());
        existing.setEndTime(dto.getEndTime());
        existing.setDurationMinutes((int) Duration.between(dto.getStartTime(), dto.getEndTime()).toMinutes());
        existing.setRecordDate(dto.getStartTime().toLocalDate());

        return mapToResponse(recordRepository.save(existing));
    }

    public void delete(Integer id) {
        if (!recordRepository.existsById(id)) {
            throw new EntityNotFoundException("记录不存在");
        }
        recordRepository.deleteById(id);
    }

    private Category fetchCategory(Integer categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("分类不存在"));
    }

    private void validateTimeRange(RecordRequestDTO dto) {
        if (dto.getEndTime().isBefore(dto.getStartTime()) || dto.getEndTime().isEqual(dto.getStartTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "结束时间必须晚于开始时间");
        }
    }

    private RecordResponseDTO mapToResponse(TimeRecord r) {
        return RecordResponseDTO.builder()
                .id(r.getId())
                .activityName(r.getActivityName())
                .categoryId(r.getCategory().getId())
                .categoryName(r.getCategory().getName())
                .startTime(r.getStartTime())
                .endTime(r.getEndTime())
                .durationMinutes(r.getDurationMinutes())
                .recordDate(r.getRecordDate())
                .build();
    }
}
