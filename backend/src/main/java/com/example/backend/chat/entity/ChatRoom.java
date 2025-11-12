package com.example.backend.chat.entity;

import com.example.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.validator.constraints.br.CPF;

import java.time.Instant;

@Entity
@Data
@Table(name = "CHATROOM")
public class ChatRoom {
    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "admin_id", nullable = false)
    private Long adminId;

    @Column(name = "unreadCount")
    private int unreadCount;

    @Column(columnDefinition = "TEXT") 
    private String lastMessage;

    @Column(name = "last_message_at", updatable = false, nullable = false)
    private Instant lastMessageAt = Instant.now();
}
