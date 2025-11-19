package com.example.backend.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendResetToken(String to, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("[Gym Projector] 비밀번호 재설정 링크입니다.");
        message.setText("비밀번호를 재설정하려면 아래 링크를 클릭하세요.\n\n" +
                resetLink + "\n\n" +
                "이 링크는 30분 동안만 유효합니다.");

        try {
            mailSender.send(message);
            log.info("Password reset email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email", e);
            throw new RuntimeException("이메일 발송에 실패했습니다.");
        }
    }
}
