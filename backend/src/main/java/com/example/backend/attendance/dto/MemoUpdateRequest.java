package com.example.backend.attendance.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MemoUpdateRequest {
    @Size(max = 1000, message = "Memo must be less than 1000 characters")
    private String memo;
}
