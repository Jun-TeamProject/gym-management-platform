package com.example.backend.attendance.dto;

import com.example.backend.attendance.entity.DailyLog;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyLogResponse {
    private Long id;
    private LocalDate logDate;
    private String memo;
    private String status;

    public static DailyLogResponse fromEntity(DailyLog dailyLog) {
        return DailyLogResponse.builder()
                .id(dailyLog.getId())
                .logDate(dailyLog.getLogDate())
                .memo(dailyLog.getMemo())
                .status(dailyLog.getStatus() != null ? dailyLog.getStatus().name() : null)
                .build();
    }
}
