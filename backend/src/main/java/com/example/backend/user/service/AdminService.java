package com.example.backend.user.service;

import com.example.backend.membership.dto.MembershipDto;
import com.example.backend.membership.entity.Membership;
import com.example.backend.payment.dto.PaymentHistoryResponse;
import com.example.backend.payment.entity.Payment;
import com.example.backend.payment.entity.PaymentStatus;
import com.example.backend.payment.repository.PaymentRepository;
import com.example.backend.user.dto.RoleChangeRequest;
import com.example.backend.user.dto.UserDto;
import com.example.backend.user.entity.Role;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

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

    private UserDto convertToUserDto(User user) {
        List<Membership> allMemberships = user.getMemberships();

        int totalPtCountRemaining = 0;
        Membership ActiveMembershipEntity = null;

        if (allMemberships != null) {
            for (Membership membership : allMemberships) {
                if (!membership.getStatus().name().equals("ACTIVE")) {
                    continue;
                }

                //pt
                if (membership.getStartDate().isEqual(membership.getEndDate())) {
                    totalPtCountRemaining = membership.getPtCountRemaining();
                //일반멤버십
                } else {
                    ActiveMembershipEntity = membership;
                }
            }
        }

        UserDto userDto = UserDto.fromEntity(user);

        //pt가 아닌 멤버십을 front로 보내주기 위해 dto로 변환
        MembershipDto latestMembershipDto = ActiveMembershipEntity != null
                ? MembershipDto.fromEntity(ActiveMembershipEntity)
                : null;

        userDto.setMembership(latestMembershipDto);
        userDto.setTotalPtCountRemaining(totalPtCountRemaining);

        return userDto;
    }
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers(String role) {
        List<User> users;

        if (role == null || role.isBlank()) {
            users = userRepository.findAll();
        } else {
            try {
                Role filterRole = Role.valueOf(role.toUpperCase());
                users = userRepository.findAllByRoleWithMemberships(filterRole);
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

    @Transactional(readOnly = true)
    public List<PaymentHistoryResponse> getPaymentHistory(String period) {
        LocalDateTime startDate;
        LocalDate now = LocalDate.now();

        switch (period.toUpperCase()) {
            case "DAY":
                startDate = now.atStartOfDay();
                break;
            case "WEEK":
                startDate = now.minusWeeks(1).atStartOfDay();
                break;
            case "MONTH":
                startDate = now.minusMonths(1).atStartOfDay();
                break;
            default:
                startDate = now.minusYears(1).atStartOfDay();
        }

        List<Payment> payments = paymentRepository.findAllByStatusAndApprovedAtAfterOrderByApprovedAtDesc(
                PaymentStatus.DONE,
                startDate
        );

        return payments.stream()
                .map(PaymentHistoryResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
