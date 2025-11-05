package com.example.backend.payment.client;

import com.example.backend.global.config.TossPaymentConfig;
import com.example.backend.payment.dto.TossPaymentResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Base64;
import java.util.Map;

@Service
@Slf4j
public class TossPaymentsApiClient {
    private final TossPaymentConfig config;
    private final WebClient webClient;

    public TossPaymentsApiClient(TossPaymentConfig config) {
        this.config = config;
        this.webClient = WebClient.builder()
                .baseUrl(config.getApi().getBaseUrl())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    // (Toss 연습 프로젝트와 동일한 confirmPayment 메서드)
    public TossPaymentResponse confirmPayment(String paymentKey, String orderId, Integer amount) {
        String auth = createAuthHeader();
        log.info("토스페이먼츠 결제 승인 요청 시작 - Payment Key: {}, Order ID: {}", paymentKey, orderId);

        try {
            return webClient.post()
                    .uri("/payments/confirm")
                    .header(HttpHeaders.AUTHORIZATION, auth)
                    .bodyValue(Map.of(
                            "paymentKey", paymentKey,
                            "orderId", orderId,
                            "amount", amount
                    ))
                    .retrieve()
                    .bodyToMono(TossPaymentResponse.class)
                    .block();
        } catch(Exception e) {
            log.error("토스페이먼츠 API 호출 실패: {}", e.getMessage());
            throw new RuntimeException("결제 승인 API 호출 실패: " + e.getMessage());
        }
    }

    private String createAuthHeader() {
        String credentials = config.getSecretKey() + ":";
        String encoded = Base64.getEncoder().encodeToString(credentials.getBytes());
        return "Basic " + encoded;
    }
}
