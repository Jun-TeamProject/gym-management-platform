package com.example.backend.comment.service;

import com.example.backend.comment.dto.CommentRequest;
import com.example.backend.comment.dto.CommentResponse;
import com.example.backend.comment.entity.Comment;
import com.example.backend.post.entity.Post;
import com.example.backend.user.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.comment.repository.CommentRepository;
import com.example.backend.post.repository.PostRepository;
import com.example.backend.user.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final AuthenticationService authenticationService;

    public CommentResponse createComment(Long postId, CommentRequest request) {
        User currentUser = authenticationService.getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found"));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .post(post)
                .user(currentUser)
                .build();

        comment = commentRepository.save(comment);
        return CommentResponse.fromEntity(comment);
    }

    @Transactional(readOnly = true)
    public Page<CommentResponse> getComments(Long postId, Pageable pageable) {
        authenticationService.getCurrentUser();

        postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Page<Comment> comments = commentRepository.findByPostId(postId, pageable);
        return comments.map(CommentResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Long getUserCommentCount(Long postId) {
        authenticationService.getCurrentUser();
        return commentRepository.countByPostId(postId);
    }

    public CommentResponse updateComment(Long commentId,CommentRequest request) {
        User currentUser = authenticationService.getCurrentUser();
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to update this comment");
        }

        comment.setContent(request.getContent());

        comment = commentRepository.save(comment);
        return CommentResponse.fromEntity(comment);
    }

    public void deleteComment(Long commentId) {
        User currentUser = authenticationService.getCurrentUser();
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to update this comment");
        }

        commentRepository.deleteById(commentId);
    }
}
