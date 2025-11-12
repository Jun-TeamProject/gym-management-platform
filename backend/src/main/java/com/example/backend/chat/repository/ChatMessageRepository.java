package com.example.backend.chat.repository;

import com.example.backend.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage,Long> {
    List<ChatMessage> findByChatRoomIdOrderBySentAtAsc(Long chatRoomId);

    @Query("SELECT COUNT(m) FROM ChatMessage m " +
            "WHERE m.chatRoom.id = :roomId " +
            "AND m.senderId = :userId " +
            "AND m.isRead = false")
    int countUnreadMessagesByRoomId(@Param("roomId") Long roomId,
                                    @Param("userId") Long userId);

    @Modifying
    @Query("UPDATE ChatMessage m SET m.isRead = true " +
            "WHERE m.chatRoom.id = :roomId " +
            "AND m.senderId = :userId " +
            "AND m.isRead = false")
    void markAllMessagesAsRead(@Param("roomId") Long roomId,
                              @Param("userId") Long userId);
}
