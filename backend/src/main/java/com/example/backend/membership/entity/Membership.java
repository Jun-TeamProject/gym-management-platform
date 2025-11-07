package com.example.backend.membership.entity;

import com.example.backend.payment.entity.Payment;
import com.example.backend.product.entity.Product;
import com.example.backend.user.entity.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "T_MEMBERSHIP")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Membership {

    public enum MembershipStatus {
        ACTIVE, // 활성
        EXPIRED, // 만료
        PAUSED // 정지
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ----- 연관 관계 (핵심) -----
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 이용권 소유자 (관계 - ERD 기반)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnore
    private Product product; // 구매한 상품

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false, unique = true)
    private Payment payment; // 이 이용권을 생성한 결제 기록

    // ----- 이용권 정보 -----
    @Column(nullable = false)
    private LocalDate startDate; // 시작일

    @Column(nullable = false)
    private LocalDate endDate; // 만료일

    @Column(nullable = false)
    private int ptCountRemaining; // 남은 PT 횟수 (PT 상품이 아니면 0)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MembershipStatus status; // 이용권 상태

    // --- 엔티티 생성 메서드 (Payment 성공 시 호출) ---
    public static Membership create(Payment payment) {
        User user = payment.getUser();
        Product product = payment.getProduct();

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusMonths(product.getDurationMonths() != null ? product.getDurationMonths() : 0);

        // 상품 타입이 PT인지 확인 (Product 엔티티의 Enum 이름에 따라 수정 필요)
//        int ptCount = (product.getType() == Product.ProductType.PT)
//                // 예: 1개월(10회) 상품이면 10 (이 로직은 정책에 따라 변경)
//                ? (product.getDurationMonths() != null ? product.getSessionCount() : 0)
//                : 0;
        int ptCount = 0;
        if (product.getType() == Product.ProductType.PT) {
            ptCount = (product.getSessionCount() != null ? product.getSessionCount() : 0);
        }

        return Membership.builder()
                .user(user)
                .product(product)
                .payment(payment)
                .startDate(startDate)
                .endDate(endDate)
                .ptCountRemaining(ptCount)
                .status(MembershipStatus.ACTIVE)
                .build();
    }

    public void extend(Product product) {
        LocalDate newEndDate;

        if (this.endDate.isBefore(LocalDate.now())) {
            newEndDate  = LocalDate.now().plusMonths(product.getDurationMonths() !=null ? product.getDurationMonths() : 0);
        } else {
            newEndDate = this.endDate.plusMonths(product.getDurationMonths() != null ? product.getDurationMonths() : 0);
        }
        this.endDate = newEndDate;
        this.status = MembershipStatus.ACTIVE;

        //PT
        if (product.getType() == Product.ProductType.PT) {
            this.ptCountRemaining += (product.getSessionCount() != null ? product.getSessionCount() : 0);
        }

//        this.status = MembershipStatus.ACTIVE;
        this.product = product;
    }

    // (추가) 이용권 연장, PT 횟수 차감 등의 비즈니스 메서드
}

