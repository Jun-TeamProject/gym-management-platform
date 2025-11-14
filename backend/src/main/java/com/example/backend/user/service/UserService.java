package com.example.backend.user.service;

import com.example.backend.branch.entity.Branch;
import com.example.backend.branch.repository.BranchRepository;
import com.example.backend.global.service.FileUploadService;
import com.example.backend.user.dto.ProfileUpdateRequest;
import com.example.backend.user.dto.UserDto;
import com.example.backend.user.entity.Gender;
import com.example.backend.user.entity.Role;
import com.example.backend.user.entity.User;
import com.example.backend.user.exception.UserAlreadyExistsException;
import com.example.backend.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;
    private final FileUploadService fileUploadService;

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
}
