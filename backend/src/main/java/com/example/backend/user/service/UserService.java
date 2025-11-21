package com.example.backend.user.service;

import com.example.backend.branch.entity.Branch;
import com.example.backend.branch.repository.BranchRepository;
import com.example.backend.global.service.FileUploadService;
import com.example.backend.membership.entity.Membership;
import com.example.backend.membership.repository.MembershipRepository;
import com.example.backend.reservation.entity.Reservation;
import com.example.backend.reservation.entity.Status;
import com.example.backend.reservation.repository.ReservationRepository;
import com.example.backend.user.dto.ProfileUpdateRequest;
import com.example.backend.user.dto.UserDto;
import com.example.backend.user.entity.Gender;
import com.example.backend.user.entity.Provider;
import com.example.backend.user.entity.Role;
import com.example.backend.user.entity.User;
import com.example.backend.user.exception.UserAlreadyExistsException;
import com.example.backend.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;
    private final FileUploadService fileUploadService;
    private final PasswordEncoder passwordEncoder;
    private final ReservationRepository reservationRepository;
    private final MembershipRepository membershipRepository;

    @Transactional(readOnly = true)
    public UserDto getMyProfile(UserDetails userDetails) {
        String email = userDetails.getUsername();

         User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));

         return UserDto.fromEntity(user);
    }

    public UserDto updateMyProfile(UserDetails userDetails, ProfileUpdateRequest request) {
        String email = userDetails.getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));

        String newUsername = request.getUsername();
        if (newUsername != null && !newUsername.equals(user.getRealUsername())) {
            if (userRepository.existsByUsername(newUsername)) {
                throw new UserAlreadyExistsException("Username already exists: " + newUsername);
            }
            user.setUsername(newUsername);
        }

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getProfileImageUrl() != null) {
            user.setProfileImageUrl(request.getProfileImageUrl());
        }
        if (request.getGender() != null) {
            try {
                user.setGender(Gender.valueOf(request.getGender().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid gender: " + request.getGender());
            }
        }
        if (request.getBirthdate() != null) {
            user.setBirthdate(request.getBirthdate());
        }
        if (request.getBranchId() != null) {
            Branch branch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> new EntityNotFoundException("Branch not found with id: " + request.getBranchId()));
            user.setBranch(branch);
        }

        User updatedUser = userRepository.save(user);
        return UserDto.fromEntity(updatedUser);
    }

    public UserDto updateMyProfileImage(UserDetails userDetails, MultipartFile file) throws IOException {
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));

        String imageUrl = fileUploadService.storeFile(file, "avatars");

        user.setProfileImageUrl(imageUrl);
        User updateUser = userRepository.save(user);

        return UserDto.fromEntity(updateUser);
    }

    @Transactional(readOnly = true)
    public List<UserDto> getTrainers() {
        return userRepository.findAllByRole(Role.TRAINER)
                .stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void withdraw(UserDetails userDetails, String password) {
        String email = userDetails.getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));

        if (user.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("관리자 계정은 탈퇴가 불가능합니다.");
        }

        if (user.getProvider() == Provider.LOCAL) {
            if (password == null || !passwordEncoder.matches(password, user.getPassword())) {
                throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
            }
        }

        List<Reservation> futureReservations = reservationRepository.findAllFutureReservationsByMemberId(
                user.getId(),
                LocalDateTime.now()
        );

        for (Reservation reservation : futureReservations) {
            reservation.setStatus(Status.CANCELLED);
            reservation.setMemo("[회원 탈퇴] 로 인한 자동 취소");
        }

        List<Membership> activeMemberships = membershipRepository.findAllByUserIdAndStatus(
                user.getId(),
                Membership.MembershipStatus.ACTIVE
        );

        for (Membership membership : activeMemberships) {
            membership.setStatus(Membership.MembershipStatus.EXPIRED);
            membership.setPtCountRemaining(0);
            membership.setEndDate(LocalDateTime.now().toLocalDate().minusDays(1));
        }

        user.setEnabled(false);
        user.setDeletedAt(LocalDateTime.now());

        String timestamp =String.valueOf(System.currentTimeMillis());

        user.setUsername("탈퇴한회원_" + timestamp);
        user.setEmail("unknown_" + user.getId() + "_" + timestamp + "@deleted.user");

        userRepository.save(user);
    }
}
