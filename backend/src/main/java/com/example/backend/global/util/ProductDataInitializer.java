package com.example.backend.global.util;

import com.example.backend.product.entity.Product;
import com.example.backend.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(2)
public class ProductDataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        // 더미 상품 데이터 생성
        createDummyProducts();
    }

    private void createDummyProducts() {
        // 이미 상품이 존재하면 생성하지 않음
        if (productRepository.count() > 0) {
            log.info("상품 데이터가 이미 존재합니다. (총 {}개)", productRepository.count());
            return;
        }

        // 멤버십 상품
        Product membership1Month = Product.builder()
                .type(Product.ProductType.Membership)
                .name("1개월 헬스 회원권")
                .price(50000)
                .durationMonths(1)
                .build();

        Product membership3Months = Product.builder()
                .type(Product.ProductType.Membership)
                .name("3개월 헬스 회원권")
                .price(135000)
                .durationMonths(3)
                .build();

        Product membership6Months = Product.builder()
                .type(Product.ProductType.Membership)
                .name("6개월 헬스 회원권")
                .price(250000)
                .durationMonths(6)
                .build();

        Product membership12Months = Product.builder()
                .type(Product.ProductType.Membership)
                .name("12개월 헬스 회원권")
                .price(450000)
                .durationMonths(12)
                .build();

        // PT 상품
        Product pt10Sessions = Product.builder()
                .type(Product.ProductType.PT)
                .name("PT 10회권")
                .price(300000)
                .sessionCount(10)
                .build();

        Product pt20Sessions = Product.builder()
                .type(Product.ProductType.PT)
                .name("PT 20회권")
                .price(550000)
                .sessionCount(20)
                .build();

        Product pt30Sessions = Product.builder()
                .type(Product.ProductType.PT)
                .name("PT 30회권")
                .price(750000)
                .sessionCount(30)
                .build();

        Product pt50Sessions = Product.builder()
                .type(Product.ProductType.PT)
                .name("PT 50회권")
                .price(1200000)
                .sessionCount(50)
                .build();

        // 저장
        List<Product> products = List.of(
                membership1Month, membership3Months, membership6Months, membership12Months,
                pt10Sessions, pt20Sessions, pt30Sessions, pt50Sessions
        );

        productRepository.saveAll(products);

        log.info("더미 상품 데이터가 생성되었습니다. (총 {}개)", products.size());
        products.forEach(p -> log.info("- {} ({}: {}원)",
                p.getName(),
                p.getType(),
                String.format("%,d", p.getPrice())
        ));
    }
}