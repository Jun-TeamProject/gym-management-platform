package com.example.backend.user.service;

import com.example.backend.user.entity.Provider;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final StringRedisTemplate redisTemplate;
    private final EmailService emailService;

    @Value("${frontend.url}")
    private String frontendUrl;

    // 비밀번호 재설정 요청
    // 이메일 입력 -> 토큰 생성 -> 이메일 발송
    @Transactional
    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));

        if (user.getProvider() != Provider.LOCAL) {
            throw new IllegalArgumentException("소셜 로그인 사용자는 비밀번호를 변경할 수 없습니다.");
        }

        String token = UUID.randomUUID().toString();

        // Redis에 토큰 저장 (key: token, value: email, 유효시간: 30분)
        redisTemplate.opsForValue().set(token, email, Duration.ofMinutes(30));

        String resetLink = frontendUrl + "/reset-password?token=" + token;

        emailService.sendResetToken(email,resetLink);
    }

    // 비밀번호 변경
    // 토큰 검증 -> 비밀번호 변경 -> 토큰 삭제
    @Transactional
    public void resetPassword(String token, String newPassword) {
        // 토큰으로 email 조회
        String email = redisTemplate.opsForValue().get(token);

        if (email == null) {
            throw new IllegalArgumentException("유효하지 않거나 만료된 이메일입니다.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // 재사용 방지 위해 토큰 삭제
        redisTemplate.delete(token);
    }
}
