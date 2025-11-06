package com.example.backend.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;
    private String name;
    private Integer durationMonths;
    private Integer sessionCount; //PT 횟수
    public enum ProductType{
        Membership, PT
    }
}