package com.example.backend.user.dto;

import com.example.backend.membership.dto.MembershipDto;
import com.example.backend.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String profileImageUrl;
    private String role;
    private String fullName;
    private String phoneNumber;
    private String bio;
    private String gender;
    private LocalDate birthdate;
    private MembershipDto membership;
    private MembershipDto ptMembership;

    private Long branchId;
    private String branchName;
    private List<MembershipDto> memberships;

    private int totalPtCountRemaining;

    public static UserDto fromEntity(User user) {
        List<MembershipDto> membershipDtos;
        if (user.getMemberships() == null) {
            //
            membershipDtos = Collections.emptyList();
        } else {
            //
            membershipDtos = user.getMemberships().stream()
                    .map(MembershipDto::fromEntity)
                    .collect(Collectors.toList());
        }

        return UserDto.builder()
                .id(user.getId())
                .username(user.getRealUsername())
                .email(user.getEmail())
                .profileImageUrl(user.getProfileImageUrl())
                .role(user.getRole().getKey())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .bio(user.getBio())
                .gender(user.getGender() != null ? user.getGender().name() : null)
                .birthdate(user.getBirthdate())
                .branchId(user.getBranch() != null ? user.getBranch().getId() : null)
                .branchName(user.getBranch() != null ? user.getBranch().getBranchName() : null)
                .memberships(membershipDtos)
                .build();
    }
}
