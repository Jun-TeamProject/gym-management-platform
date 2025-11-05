package com.example.backend.user.service;

import com.example.backend.user.dto.ProfileUpdateRequest;
import com.example.backend.user.dto.UserDto;
import com.example.backend.user.entity.Gender;
import com.example.backend.user.entity.User;
import com.example.backend.user.exception.UserAlreadyExistsException;
import com.example.backend.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;

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

        User updatedUser = userRepository.save(user);
        return UserDto.fromEntity(updatedUser);
    }
}
