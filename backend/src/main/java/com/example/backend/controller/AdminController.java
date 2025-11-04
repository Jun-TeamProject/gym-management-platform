package com.example.backend.controller;

import com.example.backend.dto.RoleChangeRequest;
import com.example.backend.dto.UserDto;
import com.example.backend.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<UserDto> updateUserRole(
            @PathVariable Long userId,
            @Valid @RequestBody RoleChangeRequest request
    ) {
        UserDto updatedUser = adminService.changUserRole(userId, request);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers(
            @RequestParam(required = false) String role
    ) {
        List<UserDto> users = adminService.getAllUsers(role);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long userId) {
        UserDto user = adminService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}
