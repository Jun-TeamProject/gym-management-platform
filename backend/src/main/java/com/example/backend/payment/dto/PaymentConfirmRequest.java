package com.example.backend.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentConfirmRequest {
    @NotBlank
    private String paymentKey;

    @NotBlank
    private String orderId;

    @NotNull
    private int amount; // 결제 금액 == product.price
}
