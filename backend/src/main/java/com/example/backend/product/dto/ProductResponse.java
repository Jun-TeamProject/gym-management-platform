package com.example.backend.product.dto;

import com.example.backend.product.entity.Product;
import com.example.backend.product.entity.Product.ProductType;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {
    private Long productId;
    private ProductType type;
    private String name;
    private int price;
    private Integer durationMonths;
    private Integer sessionCount;

    public static ProductResponse of(Product product) {
        return ProductResponse.builder()
                .productId(product.getProductId())
                .type(product.getType())
                .name(product.getName())
                .price(product.getPrice())
                .durationMonths(product.getDurationMonths())
                .sessionCount(product.getSessionCount())
                .build();

    }
}
