package com.lyubishchev.repository;

import com.lyubishchev.entity.TimeRecord;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecordRepository extends JpaRepository<TimeRecord, Integer> {
    List<TimeRecord> findByRecordDateOrderByStartTimeAsc(LocalDate recordDate);
    List<TimeRecord> findByRecordDateBetweenOrderByStartTimeAsc(LocalDate startDate, LocalDate endDate);
    boolean existsByCategoryId(Integer categoryId);
}
