package com.example.backend.attendance.controller;

import com.example.backend.attendance.dto.DailyLogResponse;
import com.example.backend.attendance.dto.MemoUpdateRequest;
import com.example.backend.attendance.entity.AttendanceStatus;
import com.example.backend.attendance.service.DailyLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/dailyLog")
@RequiredArgsConstructor
public class DailyLogController {
    private final DailyLogService dailyLogService;

    @GetMapping("/calendar")
    public ResponseEntity<List<DailyLogResponse>> getMyMonthlyLogs(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("month") @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth
    ) {
        System.out.println(yearMonth);
        List<DailyLogResponse> monthlyLogs = dailyLogService.getMonthlyLogs(userDetails, yearMonth);
        return ResponseEntity.ok(monthlyLogs);
    }

    @PutMapping("/calendar/{date}/memo")
    public ResponseEntity<DailyLogResponse> updateOrCreateMemo(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @Valid @RequestBody MemoUpdateRequest request
    ) {
        DailyLogResponse newDailyLog = dailyLogService.updateOrCreateMemo(userDetails, date, request);
        return ResponseEntity.ok(newDailyLog);
    }

    @PostMapping("/check-in")
    public ResponseEntity<String> checkInToday(@AuthenticationPrincipal UserDetails userDetails) {
        LocalDate today = LocalDate.now();

        dailyLogService.updateAttendanceStatus(
                userDetails,
                today,
                AttendanceStatus.PRESENT
        );

        return ResponseEntity.ok(today + "출석 체크 완료!");
    }
}
