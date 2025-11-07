package com.example.backend.payment.repository;

import com.example.backend.payment.entity.Payment;
import com.example.backend.payment.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrderId(String orderId);
    Optional<Payment> findByPaymentKey(String paymentKey);

//    List<Payment> findAllByUserIdOrderByApprovedAtDesc(Long userId);
List<Payment> findAllByUserIdAndStatusOrderByApprovedAtDesc(Long userId, PaymentStatus status);
}
