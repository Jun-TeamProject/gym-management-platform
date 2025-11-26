package com.example.backend.payment.controller;

import com.example.backend.global.config.TossPaymentConfig;
import com.example.backend.payment.dto.*;
import com.example.backend.payment.entity.Payment;
import com.example.backend.payment.service.PaymentService;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
@Slf4j
public class PaymentController {
    private final PaymentService paymentService;
    private final UserRepository userRepository;
    private final TossPaymentConfig tossPaymentConfig;
    /**
     * API 1: 결제 준비 (React가 위젯 렌더링 전 호출)
     */
    @PostMapping("/prepare")
    @PreAuthorize("hasAuthority('MEMBER')") // 회원만 결제 준비 가능
    public ResponseEntity<PaymentPrepareResponse> preparePayment(
            @Valid @RequestBody PaymentPrepareRequest request,
            Authentication authentication) {

//        // SecurityContext에서 현재 로그인한 사용자 ID 가져오기
//        User currentUser = (User) authentication.getPrincipal();
//        Long userId = currentUser.getId();

        String loginId = authentication.getName();
        User currentUer = userRepository.findByEmail(loginId)
                .or(() -> userRepository.findByUsername(loginId))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + loginId));

        Long userId = currentUer.getId();

        PaymentPrepareResponse response = paymentService.preparePayment(request, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * API 2: 결제 승인 (React가 Toss 리디렉션 후 호출)
     */
    @PostMapping("/confirm")
    @PreAuthorize("hasAuthority('MEMBER')") // 회원만 결제 승인 가능
    public ResponseEntity<PaymentConfirmResponse> confirmPayment(
            @Valid @RequestBody PaymentConfirmRequest request,
            Authentication authentication) {

//        User currentUser = (User) authentication.getPrincipal();
//        Long userId = currentUser.getId();

        String loginId = authentication.getName();
        User currentUser = userRepository.findByEmail(loginId)
                .or(() -> userRepository.findByUsername(loginId))
                .orElseThrow(()-> new UsernameNotFoundException("User not found: " + loginId));

        Long userId = currentUser.getId();

        try {
            PaymentConfirmResponse response = paymentService.confirmPayment(request, userId);
            return ResponseEntity.ok(response); // 성공 시 결제 정보 반환
        } catch (Exception e) {
            log.error("결제 승인 API 실패: {}", e.getMessage());
            return ResponseEntity.status(400).body(null); // 실패 응답
        }
    }

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('MEMBER')")
    public ResponseEntity<List<PaymentHistoryResponse>> getMyPayments(Authentication authentication){

        String loginId = authentication.getName();
        User currentUser = userRepository.findByEmail(loginId)
                .or(() -> userRepository.findByUsername(loginId))
                .orElseThrow(()-> new UsernameNotFoundException("User not found: " + loginId));

        List<PaymentHistoryResponse> paymentHistory = paymentService.getMyPayments(currentUser.getId());
        return ResponseEntity.ok(paymentHistory);
    }

    @GetMapping("/admin/user/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<PaymentHistoryResponse>> getUserPaymentsByAdmin(
            @PathVariable Long userId
    ) {
        List<PaymentHistoryResponse> paymentHistory = paymentService.getMyPayments(userId);
        return ResponseEntity.ok(paymentHistory);
    }
}
