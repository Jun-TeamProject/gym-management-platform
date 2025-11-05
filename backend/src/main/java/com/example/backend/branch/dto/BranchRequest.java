package com.example.backend.branch.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchRequest {
    @NotBlank(message = "지점 이름은 필수입니다.")
    private String branchName;

    private String location;
    private String phone;
}
