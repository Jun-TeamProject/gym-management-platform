package com.example.backend.user.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AdminMembershipUpdateRequest {
    //null 이 아닌 경우에만 수정가능
    private LocalDate endDate;
    private Integer ptCountRemaining;
}
