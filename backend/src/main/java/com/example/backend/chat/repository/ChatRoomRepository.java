package com.example.backend.chat.repository;

import com.example.backend.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long>{
    Optional<ChatRoom> findByUserIdAndAdminIdOrAdminIdAndUserId(Long id1, Long id2, Long id3, Long id4);

    List<ChatRoom> findAllByOrderByLastMessageAtDesc();

    @Query("SELECT cr FROM ChatRoom cr JOIN FETCH cr.user ORDER BY cr.lastMessageAt DESC")
    List<ChatRoom> findChatRoomsWithUser();


}
