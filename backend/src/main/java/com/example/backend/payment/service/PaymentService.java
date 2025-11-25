package com.example.backend.payment.service;

import com.example.backend.global.config.TossPaymentConfig;
import com.example.backend.membership.repository.MembershipRepository;
import com.example.backend.payment.client.TossPaymentsApiClient;
import com.example.backend.payment.dto.*;
import com.example.backend.membership.entity.Membership;
import com.example.backend.payment.entity.Payment;
import com.example.backend.payment.entity.PaymentStatus;
import com.example.backend.payment.repository.PaymentRepository;
import com.example.backend.product.entity.Product;
import com.example.backend.product.repository.ProductRepository;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final MembershipRepository membershipRepository; // 회원권 리포지토리
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final TossPaymentsApiClient tossPaymentsApiClient;
    private final TossPaymentConfig tossPaymentConfig;

    /**
     * API 1: 결제 준비 (Prepare)
     */
    @Transactional
    public PaymentPrepareResponse preparePayment(PaymentPrepareRequest request, Long userId) {
        // 1. 사용자 및 상품 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        // 2. 주문번호 생성
        String orderId = generateOrderId();

        // 3. Payment 엔티티 생성 및 저장 (상태: READY)
        Payment payment = Payment.create(user, product, orderId);
        paymentRepository.save(payment);

        log.info("결제 준비 완료: orderId={}, amount={}", orderId, product.getPrice());

        // 4. React에 응답
        return PaymentPrepareResponse.of(payment, tossPaymentConfig.getClientKey());
    }

    /**
     * API 2: 결제 승인 (Confirm)
     */
    @Transactional
    public PaymentConfirmResponse confirmPayment(PaymentConfirmRequest request, Long userId) {
        // 1. 주문(Payment) 조회 및 검증
        Payment payment = paymentRepository.findByOrderId(request.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("결제 정보를 찾을 수 없습니다: " + request.getOrderId()));

        // 2. 결제 요청자(userId)와 주문자(payment.user)가 일치하는지 확인 (보안)
        if (!payment.getUser().getId().equals(userId)) {
            throw new SecurityException("결제 정보에 접근할 권한이 없습니다.");
        }

        // 3. 금액 검증 (Toss 연습 로직과 동일)
        BigDecimal requestAmount = BigDecimal.valueOf(request.getAmount());
        if (payment.getAmount().compareTo(requestAmount) != 0) {
            throw new IllegalArgumentException("결제 금액이 일치하지 않습니다.");
        }

        // 4. Toss API 호출 (Toss 연습 로직과 동일)
        try {
            TossPaymentResponse tossResponse = tossPaymentsApiClient.confirmPayment(
                    request.getPaymentKey(), request.getOrderId(), request.getAmount()
            );

            // 5. 결제 상태 'DONE'으로 승인 (Toss 연습 로직과 동일)
            payment.approve(
                    tossResponse.getPaymentKey(),
                    tossResponse.getMethod(),
                    tossResponse.getReceipt() != null ? tossResponse.getReceipt().getUrl() : null
            );

            // 6. [!!! 헬스장 프로젝트 핵심 !!!]
            //    Membership (이용권) 생성 및 저장
            //    (TODO: 기존 이용권이 있는 경우 연장 처리 로직 필요)
            Product product = payment.getProduct();

            Optional<Membership> existingMembership = membershipRepository.findActiveMembershipByUserIdAndType(
                    userId,
                    product.getType());

            if (existingMembership.isPresent()) {
                Membership membership = existingMembership.get();
                membership.extend(product);

                membershipRepository.save(membership);
                log.info("결제 승인 및 회원권 연장 완료: orderId={}, membershipId = {}", request.getOrderId(), membership.getId());
            } else {
                Membership membership = Membership.create(payment);
                membershipRepository.save(membership);
                log.info("결제 승인 및 회원권 발급 완료: orderId={}, membershipId = {}", request.getOrderId(), membership.getId());
            }
            return PaymentConfirmResponse.of(payment);
        } catch (Exception e) {
            log.error("결제 승인 실패: orderId={}, error={}", request.getOrderId(), e.getMessage());
            throw new RuntimeException("결제 승인에 실패했습니다: " + e.getMessage());
        }
    }

//            Membership membership = Membership.create(payment);
//            membershipRepository.save(membership);
//
//            log.info("결제 승인 및 회원권 발급 완료: orderId={}, membershipId={}", request.getOrderId(), membership.getId());
//
//            return PaymentConfirmResponse.of(payment);
//
//        } catch (Exception e) {
//            log.error("결제 승인 실패: orderId={}, error={}", request.getOrderId(), e.getMessage());
//            // (TODO: 결제 실패 시 Payment 상태 'CANCELLED' 또는 'FAILED'로 변경 로직)
//            throw new RuntimeException("결제 승인에 실패했습니다: " + e.getMessage());
//        }
//    }

    @Transactional(readOnly = true)
    public List<PaymentHistoryResponse> getMyPayments(Long userId) {

        List<Payment> payments = paymentRepository.findAllByUserIdAndStatusOrderByApprovedAtDesc(userId, PaymentStatus.DONE);

        return payments.stream()
                .map(PaymentHistoryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    private String generateOrderId() {
        // 헬스장 프로젝트용 주문번호
        return "GYM_" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();
    }
}
