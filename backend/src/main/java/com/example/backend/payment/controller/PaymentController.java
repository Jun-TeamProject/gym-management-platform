package com.example.backend.payment.controller;

import com.example.backend.payment.dto.PaymentConfirmRequest;
import com.example.backend.payment.dto.PaymentPrepareRequest;
import com.example.backend.payment.dto.PaymentPrepareResponse;
import com.example.backend.payment.entity.Payment;
import com.example.backend.payment.service.PaymentService;
import com.example.backend.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
@Slf4j
public class PaymentController {
    private final PaymentService paymentService;

    /**
     * API 1: 결제 준비 (React가 위젯 렌더링 전 호출)
     */
    @PostMapping("/prepare")
    @PreAuthorize("hasRole('MEMBER') or hasRole('USER')") // 회원만 결제 준비 가능
    public ResponseEntity<PaymentPrepareResponse> preparePayment(
            @Valid @RequestBody PaymentPrepareRequest request,
            Authentication authentication) {

        // SecurityContext에서 현재 로그인한 사용자 ID 가져오기
        User currentUser = (User) authentication.getPrincipal();
        Long userId = currentUser.getId();

        PaymentPrepareResponse response = paymentService.preparePayment(request, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * API 2: 결제 승인 (React가 Toss 리디렉션 후 호출)
     */
    @PostMapping("/confirm")
    @PreAuthorize("hasRole('MEMBER') or hasRole('USER')") // 회원만 결제 승인 가능
    public ResponseEntity<Payment> confirmPayment(
            @Valid @RequestBody PaymentConfirmRequest request,
            Authentication authentication) {

        User currentUser = (User) authentication.getPrincipal();
        Long userId = currentUser.getId();

        try {
            Payment payment = paymentService.confirmPayment(request, userId);
            return ResponseEntity.ok(payment); // 성공 시 결제 정보 반환
        } catch (Exception e) {
            log.error("결제 승인 API 실패: {}", e.getMessage());
            return ResponseEntity.status(400).body(null); // 실패 응답
        }
    }
}
