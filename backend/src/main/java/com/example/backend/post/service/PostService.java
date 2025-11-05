package com.example.backend.post.service;

import com.example.backend.like.repository.LikeRepository;
import com.example.backend.post.dto.PostResponse;
import com.example.backend.post.dto.PostRequest;
import com.example.backend.post.entity.Post;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.comment.repository.CommentRepository;
import com.example.backend.post.repository.PostRepository;
import com.example.backend.service.AuthenticationService;
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
public class PostService {

    private final PostRepository postRepository;
    private final AuthenticationService authenticationService;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

    public PostResponse createPost(PostRequest request) {
        User currentUser = authenticationService.getCurrentUser();

        Post post = Post.builder()
                .content(request.getContent())
                .title(request.getTitle())
                .type(request.getType())
                .fileUrl(request.getFileUrl())
                .user(currentUser)
                .build();

        post = postRepository.save(post);
        return PostResponse.fromEntity(post);
    }

    @Transactional(readOnly = true)
    public Page<PostResponse> getAllPosts(Pageable pageable) {
        User currentUser = authenticationService.getCurrentUser();
        Page<Post> posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        return posts.map(post -> {
            PostResponse response = PostResponse.fromEntity(post);
            Long likeCount = likeRepository.countByPostId(post.getId());
            boolean isLiked = likeRepository.existsByUserAndPost(currentUser, post);
            Long commentCount = commentRepository.countByPostId(post.getId());

            response.setLikeCount(likeCount);
            response.setLiked(isLiked);
            response.setCommentCount(commentCount);

            return response;
        });
    }

    @Transactional(readOnly = true)
    public Page<PostResponse> getUserPosts(Long userId, Pageable pageable) {
        User currentUser = authenticationService.getCurrentUser();
        Page<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return posts.map(post -> {
            PostResponse response = PostResponse.fromEntity(post);
            Long likeCount = likeRepository.countByPostId(post.getId());
            boolean isLiked = likeRepository.existsByUserAndPost(currentUser, post);
            Long commentCount = commentRepository.countByPostId(post.getId());

            response.setLikeCount(likeCount);
            response.setLiked(isLiked);
            response.setCommentCount(commentCount);

            return response;
        });
    }

    @Transactional(readOnly = true)
    public Long getUserPostCount(Long userId) {
        authenticationService.getCurrentUser();
        return postRepository.countByUserId(userId);
    }

    public PostResponse updatePost(Long postId, PostRequest request) {
        User currentUser = authenticationService.getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to update this post");
        }

        post.setContent(request.getContent());
        post.setTitle(request.getTitle());
        post.setFileUrl(request.getFileUrl());
        post.setType(request.getType());

        post = postRepository.save(post);
        return PostResponse.fromEntity(post);
    }

    public void deletePost(Long postId) {
        User currentUser = authenticationService.getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to update this post");
        }

        postRepository.deleteById(postId);
    }
}