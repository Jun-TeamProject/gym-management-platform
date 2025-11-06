package com.example.backend.membership.dto;

import com.example.backend.membership.entity.Membership;
import com.example.backend.membership.entity.Membership.MembershipStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class MembershipDto {
    private Long id;
    private String productName;
    private String productType;
    private LocalDate startDate;
    private LocalDate endDate;
    private int ptCountRemaining;
    private MembershipStatus status;

    //
    public static MembershipDto fromEntity(Membership membership) {
        return MembershipDto.builder()
                .id(membership.getId())
                .productName(membership.getProduct().getName()) //
                .productType(membership.getProduct().getType().name()) //
                .startDate(membership.getStartDate())
                .endDate(membership.getEndDate())
                .ptCountRemaining(membership.getPtCountRemaining())
                .status(membership.getStatus())
                .build();
    }
}
