package com.example.backend.attendance.repository;

import com.example.backend.attendance.entity.DailyLog;
import com.example.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyLogRepository extends JpaRepository<DailyLog, Long> {
    Optional<DailyLog> findByUserAndLogDate(User user, LocalDate logDate);
    List<DailyLog> findAllByUserAndLogDateBetween(User user, LocalDate startDate, LocalDate endDate);
}
