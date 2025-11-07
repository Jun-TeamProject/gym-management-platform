package com.example.backend.payment.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
// PaymentStatus.java (Toss 프로젝트의 Enum을 그대로 사용)
public enum PaymentStatus {
    READY("결제 준비"),
    IN_PROGRESS("결제 진행 중"),
    DONE("결제 완료"),
    CANCELED("결제 취소");

    private final String description;
}
