package com.example.backend.global.util;

import com.example.backend.payment.entity.Payment;
import com.example.backend.payment.entity.PaymentStatus;
import com.example.backend.payment.repository.PaymentRepository;
import com.example.backend.product.entity.Product;
import com.example.backend.product.repository.ProductRepository;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(3)
public class PaymentDataInitializer implements CommandLineRunner {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        if(paymentRepository.countByStatus(PaymentStatus.DONE) > 0) {
            log.info(" (DONE) 상태 결제 내역이 존재하므로, 데이터를 생성하지 않습니다. .");
            return;
        }

        User buyer = userRepository.findByEmail("admin@admin.com")
                .orElseThrow(() -> new RuntimeException(" 더미 결제 내역을 생성 할 기본 사용자를 찾을 수 없습니다.(admin@admin.com) .") );

        List<Product> products = productRepository.findAll();
        if(products.isEmpty()) {
            log.warn(" (ProductDataInitializer ) 상품이 존재하지 않아 결제 내역을 생성 할 수 없습니다. ");
            return;
        }

        Random random = new Random();
        LocalDate startDate = LocalDate.of(2025, 10, 1);
        LocalDate today = LocalDate.now();

        log.info("Payment 더미 데이터 생성을 시작합니다.( {} ~ {} ) ...", startDate, today);

        for (LocalDate date = startDate; !date.isAfter(today); date = date.plusDays(1)) {
            int paymentsPerDay = random.nextInt(3);

            for (int i = 0; i< paymentsPerDay; i++) {

                Product product = products.get(random.nextInt(products.size()));

                int hour = 9 + random.nextInt(12);
                int minute = random.nextInt(60);
                LocalDateTime approvedAt = date.atTime(hour, minute);

                Payment payment = createDummyPayment(buyer, product, approvedAt);
                paymentRepository.save(payment);
            }
        }
        log.info(" Payment 더미 데이터 생성이 완료되었습니다." );
    }

    private Payment createDummyPayment(User user, Product product, LocalDateTime approvedAt){
        String orderId = "DUMMY_" + UUID.randomUUID().toString().substring(0,10).toUpperCase();

        Payment payment = Payment.builder()
                .user(user)
                .product(product)
                .orderId(orderId)
                .paymentKey("dummy_key_" + orderId)
                .amount(BigDecimal.valueOf(product.getPrice()))
                .orderName(product.getName() + " (더미)")
                .status(PaymentStatus.DONE)
                .method("카드")
                .approvedAt(approvedAt)
                .receiptUrl("http://example.com/receipt/" + orderId)
                .build();
        return payment;
    }
}
