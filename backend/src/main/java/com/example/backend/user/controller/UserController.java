package com.example.backend.user.controller;

import com.example.backend.user.dto.ProfileUpdateRequest;
import com.example.backend.user.dto.UserDto;
import com.example.backend.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UserDto user = userService.getMyProfile(userDetails);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateMyProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProfileUpdateRequest request
    ) {
        UserDto updatedUser = userService.updateMyProfile(userDetails, request);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/trainers")
    public ResponseEntity<List<UserDto>> getTrainersList() {
        List<UserDto> trainers = userService.getTrainers();
        return ResponseEntity.ok(trainers);
    }
}
