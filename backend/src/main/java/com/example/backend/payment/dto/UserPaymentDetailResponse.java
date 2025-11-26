package com.example.backend.payment.dto;

import com.example.backend.membership.dto.MembershipDto;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserPaymentDetailResponse {
    private Long userId;
    private String username;
    private String email;
    private String role;

    private List<MembershipDto> activeMemberships;

    private List<PaymentHistoryResponse> payments;
}
