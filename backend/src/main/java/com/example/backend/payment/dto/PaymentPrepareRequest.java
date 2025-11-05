package com.example.backend.membership.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentPrepareRequest {
    @NotNull(message = " 상품 ID는 필수입니다.")
    private Long productId;
}
