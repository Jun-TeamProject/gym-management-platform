package com.example.backend.chat.controller;

import com.example.backend.chat.dto.ChatRoomDto;
import com.example.backend.chat.dto.MessageRequest;
import com.example.backend.chat.entity.ChatMessage;
import com.example.backend.chat.entity.ChatRoom;
import com.example.backend.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload MessageRequest msgDto) {
        System.out.println(msgDto);
        chatService.getOrCreateChatRoom(msgDto.getUserId(), msgDto.getAdminId());
        
        ChatMessage savedMessage = chatService.saveMessage(msgDto);

        Long roomId = savedMessage.getChatRoom().getId();

        messagingTemplate.convertAndSend("/topic/" + roomId, savedMessage);
    }
    @GetMapping("/api/chat/history/{roomId}")
    public ResponseEntity<List<ChatMessage>> getHistory(@PathVariable Long roomId) {
        return ResponseEntity.ok(chatService.getChatHistory(roomId));
    }
    @GetMapping("/api/chatroom")
    public ResponseEntity<List<ChatRoomDto>> getAllChatRooms() {
        System.out.println(chatService.getChatRooms());
        return ResponseEntity.ok(chatService.getChatRooms());
    }
    @PutMapping("/api/chat/update/{roomId}")
    public ResponseEntity<Void> markRoomMessagesAsRead(
            @PathVariable Long roomId,
            @RequestParam Long userId
    ) {
        chatService.markAllMessagesAsRead(roomId, userId);
        return ResponseEntity.ok().build();
    }
}
