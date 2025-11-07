package com.example.backend.user.dto;

import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ProfileUpdateRequest {
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @Size(max = 100, message = "Full name must be less than 100 characters")
    private String fullName;

    @Pattern(regexp = "^\\d{2,3}-\\d{3,4}-\\d{4}$", message = "Invalid phone number format (e.g., 010-1234-5678)")
    private String phoneNumber;

    @Size(max = 1000, message = "Bio must be less than 1000 characters")
    private String bio;

    private String profileImageUrl;

    private String gender;

    @Past(message = "Birthdate must be in the past")
    private LocalDate birthdate;

    private Long branchId;
}
