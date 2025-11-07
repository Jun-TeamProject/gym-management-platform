package com.example.backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RoleChangeRequest {
    @NotBlank(message = "New role is required")
    private String newRole;
}
