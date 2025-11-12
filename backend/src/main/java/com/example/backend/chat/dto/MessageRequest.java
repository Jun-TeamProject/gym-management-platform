package com.example.backend.chat.dto;


import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class MessageRequest {
    private String roomId;
    private Long userId;
    private Long adminId;
    private Long senderId;
    private String content;
    private Instant sentAt;
}
