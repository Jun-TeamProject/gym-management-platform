package com.example.backend.user.controller;

import com.example.backend.user.dto.ProfileUpdateRequest;
import com.example.backend.user.dto.UserDto;
import com.example.backend.user.dto.WithdrawRequest;
import com.example.backend.user.entity.Role;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import com.example.backend.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;

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

    @PutMapping(value = "/me/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserDto> updateMyProfileImage(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("image") MultipartFile file
    ) throws IOException {
        UserDto updatedUser = userService.updateMyProfileImage(userDetails, file);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/trainers")
    public ResponseEntity<List<UserDto>> getTrainersList() {
        List<UserDto> trainers = userService.getTrainers();
        return ResponseEntity.ok(trainers);
    }

    @PostMapping("/withdraw")
    public ResponseEntity<String> withdraw(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody(required = false) WithdrawRequest request
    ) {
        log.info("탈퇴 요청 사용자: {}", userDetails.getUsername());

        // 소셜 로그인 유저는 비밀번호가 null일 수 있음
        String password = (request != null) ? request.getPassword() : null;

        userService.withdraw(userDetails, password);
        return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
    }

    @GetMapping("/adminId")
    public ResponseEntity<Long> getAdminId() {
        User admin = userRepository.findAllByRole(Role.ADMIN)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("관리자 계정이 존재하지 않습니다."));

        return ResponseEntity.ok(admin.getId());
    }
}
