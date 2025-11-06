package com.example.backend.payment.dto;

import com.example.backend.payment.entity.Payment;
import com.example.backend.payment.entity.PaymentStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PaymentConfirmResponse {
    private String orderId;
    private String orderName;
    private int amount;
    private PaymentStatus status;
    private LocalDateTime approvedAt;
    private String receiptUrl;

    public static PaymentConfirmResponse of (Payment payment) {
        return PaymentConfirmResponse.builder()
                .orderId(payment.getOrderId())
                .orderName(payment.getOrderName())
                .amount(payment.getAmount().intValue())
                .status(payment.getStatus())
                .approvedAt(payment.getApprovedAt())
                .receiptUrl(payment.getReceiptUrl())
                .build();
    }
}
