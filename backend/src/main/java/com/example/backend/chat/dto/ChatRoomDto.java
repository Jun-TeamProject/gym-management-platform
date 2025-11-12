package com.example.backend.chat.dto;


import com.example.backend.chat.entity.ChatRoom;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomDto {
    private Long Id;             
    private Long userId;          
    private String username;         
    private String lastMessage;    
    private Instant lastMessageAt;  
    private int unreadCount;

    public ChatRoomDto(ChatRoom chatRoom, Long unreadCount) {
        // 이 생성자는 Service 계층에서 DTO 변환을 용이하게 합니다.
        this.Id = chatRoom.getId();
        this.userId = chatRoom.getUser().getId(); // 상대방(User1) ID 추출 가정
        this.username = chatRoom.getUser().getUsername(); // 상대방 이름 추출 가정
        this.lastMessage = chatRoom.getLastMessage();
        this.lastMessageAt = chatRoom.getLastMessageAt();
        this.unreadCount = unreadCount != null ? unreadCount.intValue() : 0;
    }
}