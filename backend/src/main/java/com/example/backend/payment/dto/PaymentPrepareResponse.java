package com.example.backend.membership.dto;

import com.example.backend.payment.entity.Payment;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PaymentPrepareResponse {
    private String orderId;
    private String orderName;
    private int amount;
    private String clientKey;

    public static PaymentPrepareResponse of (Payment payment, String clientKey) {
        return PaymentPrepareResponse.builder()
                .orderId(payment.getOrderId())
                .orderName(payment.getOrderName())
                .amount(payment.getAmount().intValue())
                .clientKey(clientKey)
                .build();

    }
}
