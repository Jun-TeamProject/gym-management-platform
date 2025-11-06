package com.example.backend.user.service;

import com.example.backend.membership.dto.MembershipDto;
import com.example.backend.membership.entity.Membership;
import com.example.backend.user.dto.RoleChangeRequest;
import com.example.backend.user.dto.UserDto;
import com.example.backend.user.entity.Role;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;

    @Transactional
    public UserDto changUserRole(Long userId, RoleChangeRequest request) {
        Role newRole;

        try {
            newRole = Role.valueOf(request.getNewRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + request.getNewRole());
        }

        if (newRole == Role.ADMIN) {
            throw new IllegalArgumentException("Cannot promote user to ADMIN");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        user.setRole(newRole);
        User updatedUser = userRepository.save(user);

        return UserDto.fromEntity(updatedUser);
    }
    private MembershipDto convertToMembershipDto(Membership membershipEntity) {
        if (membershipEntity == null) return null;

        return MembershipDto.builder()
                .id(membershipEntity.getId())
                .startDate(membershipEntity.getStartDate())
                .endDate(membershipEntity.getEndDate())
                .ptCountRemaining(membershipEntity.getPtCountRemaining())
//                .status(membershipEntity.getStatus())
                .build();
    }

    private UserDto convertToUserDto(User user) {
        MembershipDto membershipDto = convertToMembershipDto(user.getMembership());

        return UserDto.builder()
                .id(user.getId())
                .username(user.getRealUsername())
                .role(user.getRole().getKey())
                .email(user.getEmail())
                .membership(membershipDto)
                .build();
    }
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers(String role) {
        List<User> users;

        if (role == null || role.isBlank()) {
            users = userRepository.findAll();
        } else {
            try {
                Role filterRole = Role.valueOf(role.toUpperCase());
                users = userRepository.findAllByRole(filterRole);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid role value: " + role);
            }
        }

//        return users.stream()
//                .map(UserDto::fromEntity)
//                .collect(Collectors.toList());
        return users.stream()
                .map(this::convertToUserDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        return UserDto.fromEntity(user);
    }

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        if (user.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("Cannot delete an ADMIN account");
        }

        userRepository.delete(user);
    }
}
