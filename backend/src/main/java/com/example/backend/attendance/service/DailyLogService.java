package com.example.backend.attendance.service;

import com.example.backend.attendance.dto.DailyLogResponse;
import com.example.backend.attendance.dto.MemoUpdateRequest;
import com.example.backend.attendance.entity.AttendanceStatus;
import com.example.backend.attendance.entity.DailyLog;
import com.example.backend.attendance.repository.DailyLogRepository;
import com.example.backend.membership.entity.Membership;
import com.example.backend.membership.repository.MembershipRepository;
import com.example.backend.product.entity.Product;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DailyLogService {
    private final DailyLogRepository dailyLogRepository;
    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;

    @Transactional(readOnly = true)
    public List<DailyLogResponse> getMonthlyLogs(UserDetails userDetails, YearMonth yearMonth) {
        String email = userDetails.getUsername();
        System.out.println(email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));

        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<DailyLog> logs = dailyLogRepository.findAllByUserAndLogDateBetween(user, startDate, endDate);
        System.out.println(logs);
        System.out.println(startDate);
        System.out.println(endDate);
        return logs.stream()
                .map(DailyLogResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public DailyLogResponse updateOrCreateMemo(UserDetails userDetails, LocalDate date, MemoUpdateRequest request) {
        String email = userDetails.getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));

        DailyLog dailyLog = dailyLogRepository.findByUserAndLogDate(user, date)
                .orElseGet(() -> createNewDailyLog(user, date));

        dailyLog.setMemo(request.getMemo());

        DailyLog savedLog = dailyLogRepository.save(dailyLog);

        return DailyLogResponse.fromEntity(savedLog);
    }

    public void updateAttendanceStatus(UserDetails userDetails, LocalDate date, AttendanceStatus status) {
        String email = userDetails.getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));

        DailyLog dailyLog = dailyLogRepository.findByUserAndLogDate(user, date)
                .orElseGet(() -> createNewDailyLog(user, date));

        dailyLog.setStatus(status);

        dailyLogRepository.save(dailyLog);
    }

    public DailyLogResponse checkInForPtSession(UserDetails userDetails, LocalDate date) {
        String email = userDetails.getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));

        DailyLog dailyLog = dailyLogRepository.findByUserAndLogDate(user, date)
                .orElseGet(() -> createNewDailyLog(user, date));

        dailyLog.setStatus(AttendanceStatus.PRESENT);

        DailyLog savedLog = dailyLogRepository.save(dailyLog);

        return DailyLogResponse.fromEntity(savedLog);
    }

    private DailyLog createNewDailyLog(User user, LocalDate date) {
        DailyLog newLog = DailyLog.builder()
                .user(user)
                .logDate(date)
                .memo(null)
                .status(AttendanceStatus.NOT_RECORDED)
                .build();

        return dailyLogRepository.save(newLog);
    }
}
