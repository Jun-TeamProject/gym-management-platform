package com.example.backend.product.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "T_PRODUCT")
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId; // product_id

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductType type; // ENUM (PT, 헬스)

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int price; // 가격

    @Column
    private Integer durationMonths; //유효기간

    @Column
    private Integer sessionCount; //PT 횟수

    public enum ProductType {
        Membership, PT
    }


}
