package com.example.backend.user.service;

import com.example.backend.membership.dto.MembershipDto;
import com.example.backend.membership.entity.Membership;
import com.example.backend.membership.repository.MembershipRepository;
import com.example.backend.payment.dto.PaymentHistoryResponse;
import com.example.backend.payment.entity.Payment;
import com.example.backend.payment.entity.PaymentStatus;
import com.example.backend.payment.repository.PaymentRepository;
import com.example.backend.product.entity.Product;
import com.example.backend.user.dto.AdminMembershipUpdateRequest;
import com.example.backend.user.dto.RoleChangeRequest;
import com.example.backend.user.dto.UserDto;
import com.example.backend.user.entity.Role;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final MembershipRepository membershipRepository;

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

        Membership activeMembership = null;
        Membership activePt = null;

        if (allMemberships != null) {
            for (Membership membership : allMemberships) {
                if (membership.getStatus() != Membership.MembershipStatus.ACTIVE) {
                    continue;
                }
                //pt
                if (membership.getProduct().getType() == Product.ProductType.PT) {
                    activePt = membership;
                //일반멤버십
                } else {
                    activeMembership = membership;
                }
            }
        }

        UserDto userDto = UserDto.fromEntity(user);

//        //pt가 아닌 멤버십을 front로 보내주기 위해 dto로 변환
//        MembershipDto latestMembershipDto = ActiveMembershipEntity != null
//                ? MembershipDto.fromEntity(ActiveMembershipEntity)
//                : null;

        userDto.setMembership(activeMembership != null ? MembershipDto.fromEntity(activeMembership) : null);
        userDto.setPtMembership(activePt != null ? MembershipDto.fromEntity(activePt) : null);

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
    public List<PaymentHistoryResponse> getPaymentHistory(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
//        LocalDate now = LocalDate.now();
        List<Payment> payments = paymentRepository.findAllByStatusAndApprovedAtBetweenOrderByApprovedAtDesc(
                PaymentStatus.DONE,
                startDateTime,
                endDateTime
        );

//        switch (period.toUpperCase()) {
//            case "DAY":
//                startDate = now.atStartOfDay();
//                break;
//            case "WEEK":
//                LocalDate sunday = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
//                startDate = sunday.atStartOfDay();
//                break;
//            case "MONTH":
//                LocalDate firstDayOfMonth = now.withDayOfMonth(1);
//                startDate = firstDayOfMonth.atStartOfDay();
//                break;
//            default:
//                LocalDate firstDayOfYear = now.withDayOfYear(1);
//                startDate = firstDayOfYear.atStartOfDay();
//        }
//
//        List<Payment> payments = paymentRepository.findAllByStatusAndApprovedAtAfterOrderByApprovedAtDesc(
//                PaymentStatus.DONE,
//                startDate
//        );

        return payments.stream()
                .map(PaymentHistoryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateMembership(Long membershipId, AdminMembershipUpdateRequest request){
        Membership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new EntityNotFoundException("Membership not found with id: " + membershipId));

        if (request.getEndDate() != null) {
            membership.setEndDate(request.getEndDate());
            log.info(" ID: {} : {}", membershipId, request.getEndDate());
        }

        if (request.getPtCountRemaining() != null) {
            membership.setPtCountRemaining(request.getPtCountRemaining());
            log.info(" ID: {} PT : {} ", membershipId, request.getPtCountRemaining());
        }

        membershipRepository.save(membership);
    }
}
