package com.example.backend.user.dto;

import com.example.backend.branch.entity.Branch;
import com.example.backend.user.entity.User;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class BranchDetailResponse {
    private Long id;
    private String branchName;
    private String location;
    private String phone;

    private List<UserDto> trainers;


    private List<String> facilityImageUrls;

    public static BranchDetailResponse of(Branch branch, List<User> trainers) {
        List<UserDto> trainerDtos = trainers.stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());

        return BranchDetailResponse.builder()
                .id(branch.getId())
                .branchName(branch.getBranchName())
                .location(branch.getLocation())
                .phone(branch.getPhone())
                .trainers(trainerDtos)
                .facilityImageUrls(branch.getFacilityImageUrls())
                .build();
    }
}
