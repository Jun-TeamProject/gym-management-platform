package com.example.backend.user.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendResetToken(String to, String resetLink) {
        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("[Gym Projector] 비밀번호 재설정 링크입니다.");

            String htmlContent = getHtmlContent(resetLink);

            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Password reset email sent to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email", e);
            throw new RuntimeException("이메일 발송에 실패했습니다.");
        }
    }

    private String getHtmlContent(String resetLink) {
        return "<div style='margin:20px; width: 80%; max-width: 600px; border: 1px solid #ddd; border-radius: 10px; padding: 20px; font-family: Arial, sans-serif;'>"
                + "<h2 style='color: #2563EB; text-align: center;'>Gym Projector</h2>"
                + "<hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;' />"
                + "<p style='font-size: 16px; color: #333;'>안녕하세요, 회원님.</p>"
                + "<p style='font-size: 16px; color: #333;'>비밀번호 재설정 요청을 받았습니다.<br>"
                + "아래 버튼을 클릭하여 새로운 비밀번호를 설정해주세요.</p>"
                + "<div style='text-align: center; margin: 30px 0;'>"
                + "<a href='" + resetLink + "' style='display: inline-block; background-color: #2563EB; color: white; text-decoration: none; padding: 12px 24px; font-size: 16px; font-weight: bold; border-radius: 5px;'>비밀번호 변경하기</a>"
                + "</div>"
                + "<p style='font-size: 14px; color: #888;'>본인이 요청하지 않았다면 이 메일을 무시하셔도 됩니다.</p>"
                + "<p style='font-size: 14px; color: #888;'>이 링크는 30분 동안만 유효합니다.</p>"
                + "</div>";
    }
}
