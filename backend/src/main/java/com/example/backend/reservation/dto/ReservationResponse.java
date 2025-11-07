package com.example.backend.reservation.dto;

import com.example.backend.reservation.entity.Reservation;
import com.example.backend.reservation.entity.Status;
import com.example.backend.user.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReservationResponse {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Status status;
    private String memo;
    private UserDto member;
    private UserDto trainer;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ReservationResponse fromEntity(Reservation reservation) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .startTime(reservation.getStartTime())
                .endTime(reservation.getEndTime())
                .status(reservation.getStatus())
                .memo(reservation.getMemo())
                .member(UserDto.fromEntity(reservation.getMember()))
                .trainer(UserDto.fromEntity(reservation.getTrainer()))
                .createdAt(reservation.getCreatedAt())
                .updatedAt(reservation.getUpdatedAt())
                .build();
    }
}
