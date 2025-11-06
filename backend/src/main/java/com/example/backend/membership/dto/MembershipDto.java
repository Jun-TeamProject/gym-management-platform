package com.example.backend.membership.dto;

import com.example.backend.product.dto.ProductDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MembershipDto {
    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private int ptCountRemaining;
//    private String status;
    private ProductDto product;
}