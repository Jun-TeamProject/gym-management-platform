package com.example.backend.branch.dto;

import com.example.backend.branch.entity.Branch;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchResponse {
    private Long id;
    private String branchName;
    private String location;
    private String phone;

    public static BranchResponse of(Branch branch) {
        return BranchResponse.builder()
                .id(branch.getId())
                .branchName(branch.getBranchName())
                .location(branch.getLocation())
                .phone(branch.getPhone())
                .build();
    }
}
