package com.example.backend.post.dto;

import com.example.backend.dto.UserDto;
import com.example.backend.post.entity.Post;
import com.example.backend.post.entity.Type;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private Type type;
    private String fileUrl;
    private UserDto user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long likeCount;
    private boolean isLiked;
    private Long commentCount;

    public static PostResponse fromEntity(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .type(post.getType())
                .fileUrl(post.getFileUrl())
                .user(UserDto.fromEntity(post.getUser()))
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
