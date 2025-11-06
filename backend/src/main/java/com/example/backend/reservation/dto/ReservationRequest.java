package com.example.backend.reservation.dto;

import com.example.backend.reservation.entity.Status;
import com.example.backend.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReservationRequest {
    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Status status;

    private String memo;

    private Long trainerId;
}
