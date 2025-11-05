package com.example.backend.payment.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class TossPaymentResponse {
    @JsonProperty("paymentKey")
    private String paymentKey;

    @JsonProperty("method")
    private String method;

    @JsonProperty("receipt")
    private Receipt receipt;

    // 향후 필요 가능성이 높은 핵심 필드
    @JsonProperty("orderId")
    private String orderId;

    @JsonProperty("orderName")
    private String orderName;

    @JsonProperty("status")
    private String status;

    @JsonProperty("totalAmount")
    private Integer totalAmount;

    @JsonProperty("approvedAt")
    private String approvedAt;

    @JsonProperty("requestedAt")
    private String requestedAt;

    @JsonProperty("type")
    private String type;

    @JsonProperty("currency")
    private String currency;

    // 에러 처리용
    @JsonProperty("failure")
    private Failure failure;

    @Data
    public static class Receipt {
        @JsonProperty("url")
        private String url;
    }

    @Data
    public static class Failure {
        @JsonProperty("code")
        private String code;

        @JsonProperty("message")
        private String message;
    }
}
