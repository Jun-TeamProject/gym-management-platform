package com.example.backend.payment.entity;

import com.example.backend.product.entity.Product;
import com.example.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "T_PAYMENT")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ----- 헬스장 프로젝트 연관 관계 (추가) -----
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 결제를 요청한 회원

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product; // 구매한 상품

    // ----- Toss Payments 기존 필드 (유지) -----
    @Column(unique = true, nullable = false)
    private String orderId; // 고유 주문번호 (예: GYM_ORDER_...)

    @Column
    private String paymentKey; // Toss 결제 고유 키

    @Column(nullable = false)
    private BigDecimal amount; // 결제 금액 (product.price와 일치해야 함)

    @Column(nullable = false)
    private String orderName; // 주문명 (product.name과 일치)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.READY; // 결제 상태

    @Column
    private String method; // 결제 수단 (카드, 가상계좌 등)

    @Column
    private LocalDateTime approvedAt; // 결제 승인 시간

    @Column
    private String receiptUrl; // 영수증 URL

    // --- 엔티티 생성 메서드 (수정) ---
    public static Payment create(User user, Product product, String orderId) {
        return Payment.builder()
                .user(user)
                .product(product)
                .orderId(orderId)
                .amount(BigDecimal.valueOf(product.getPrice())) // Product에서 금액 가져오기
                .orderName(product.getName()) // Product에서 상품명 가져오기
                .status(PaymentStatus.READY)
                .build();
    }

    // --- 상태 변경 메서드 (유지) ---
    public void approve(String paymentKey, String method, String receiptUrl) {
        this.paymentKey = paymentKey;
        this.method = method;
        this.status = PaymentStatus.DONE;
        this.approvedAt = LocalDateTime.now();
        this.receiptUrl = receiptUrl;
    }

    public void cancel(String reason) {
        this.status = PaymentStatus.CANCELLED;
        // (추가) reason 필드나 로그 필요
    }
}

