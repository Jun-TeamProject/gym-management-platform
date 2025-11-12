package com.example.backend.chat.service;

import com.example.backend.chat.dto.ChatRoomDto;
import com.example.backend.chat.dto.MessageRequest;
import com.example.backend.chat.entity.ChatMessage;
import com.example.backend.chat.entity.ChatRoom;
import com.example.backend.chat.repository.ChatMessageRepository;
import com.example.backend.chat.repository.ChatRoomRepository;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    @Transactional
    public ChatRoom getOrCreateChatRoom(Long userId, Long adminId) {
        User user = userRepository.findById(userId).orElse(null);
        Long roomId = Long.valueOf((userId + "" + adminId));
        return chatRoomRepository
                .findByUserIdAndAdminIdOrAdminIdAndUserId(userId, adminId, userId, adminId)
                .orElseGet(() -> {
                    ChatRoom newRoom = new ChatRoom();
                    newRoom.setId(roomId);
                    newRoom.setUser(user);
                    newRoom.setAdminId(adminId);
                    return chatRoomRepository.save(newRoom);
                });
    }

    @Transactional
    public ChatMessage saveMessage(MessageRequest msgDto) {
        ChatRoom chatRoom = chatRoomRepository.findById(Long.valueOf(msgDto.getRoomId()))
                .orElseThrow(() -> new IllegalArgumentException("채팅방을 찾을 수 없습니다."));

        ChatMessage chatmessage = new ChatMessage();
        chatmessage.setChatRoom(chatRoom); 
        chatmessage.setSenderId(msgDto.getSenderId());
        chatmessage.setContent(msgDto.getContent());
        chatmessage.setSentAt(msgDto.getSentAt());
        chatmessage.setIsRead(false);

        ChatMessage savedMessage = chatMessageRepository.save(chatmessage);
        if(chatmessage.getSenderId()!=1){//어드민이 보낸건 unreadcount update 안함
            int unreadCount = chatMessageRepository.countUnreadMessagesByRoomId(chatRoom.getId(),chatmessage.getSenderId());
            chatRoom.setUnreadCount(unreadCount);
        }


        chatRoom.setLastMessage(msgDto.getContent());
        chatRoom.setLastMessageAt(savedMessage.getSentAt());
        chatRoomRepository.save(chatRoom);

        return savedMessage;
    }

    public List<ChatMessage> getChatHistory(Long roomId) {
        return chatMessageRepository.findByChatRoomIdOrderBySentAtAsc(roomId);
    }
    public List<ChatRoomDto> getChatRooms() {
        List<ChatRoom> rooms = chatRoomRepository.findChatRoomsWithUser();

        return rooms.stream()
                .map(room -> {
                    User opponent = room.getUser();


                    return ChatRoomDto.builder()
                            .Id(room.getId())
                            .userId(opponent.getId())
                            .username(opponent.getRealUsername())
                            .lastMessage(room.getLastMessage())
                            .lastMessageAt(room.getLastMessageAt())
                            .unreadCount(room.getUnreadCount())
                            .build();
                })
                .collect(Collectors.toList());
    }
    @Transactional
    public void markAllMessagesAsRead(Long roomId, Long userId) {
        chatMessageRepository.markAllMessagesAsRead(roomId, userId);

        int unreadCount = chatMessageRepository.countUnreadMessagesByRoomId(roomId, userId);

        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("ChatRoom not found"));
        room.setUnreadCount(unreadCount);
        chatRoomRepository.save(room);
    }
}