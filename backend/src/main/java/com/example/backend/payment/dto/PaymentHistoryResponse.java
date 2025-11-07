package com.example.backend.payment.dto;

import com.example.backend.payment.entity.Payment;
import com.example.backend.payment.entity.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PaymentHistoryResponse {

    private String orderId;
    private String orderName;
    private int amount;
    private PaymentStatus status;
    private LocalDateTime approvedAt;
    private String receiptUrl;
    private String method;


    public static PaymentHistoryResponse fromEntity(Payment payment) {
        return PaymentHistoryResponse.builder()
                .orderId(payment.getOrderId())
                .orderName(payment.getOrderName())
                .amount(payment.getAmount().intValue())
                .status(payment.getStatus())
                .approvedAt(payment.getApprovedAt())
                .receiptUrl(payment.getReceiptUrl())
                .method(payment.getMethod())
                .build();
    }
}