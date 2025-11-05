package com.example.backend.global.util;

import com.example.backend.user.entity.Provider;
import com.example.backend.user.entity.Role;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // ADMIN 계정 생성
        createAdminUser();

        // 필요시 테스트용 계정도 생성 가능
    }

    private void createAdminUser() {
        final String ADMIN_EMAIL = "admin@admin.com";

        // 1. DB 중복 확인
        if (!userRepository.existsByEmail(ADMIN_EMAIL)) {

            User adminUser = User.builder()
                    .username("admin")
                    .email(ADMIN_EMAIL)
                    .password(passwordEncoder.encode("admin1234"))
                    .provider(Provider.LOCAL)
                    .role(Role.ADMIN)
                    .build();

            userRepository.save(adminUser);

            log.info("ADMIN 계정이 생성되었습니다. (Email: {}, PW: admin1234)", ADMIN_EMAIL);
        } else {
            log.info("ADMIN 계정이 이미 존재합니다. (Email: {}", ADMIN_EMAIL);
        }
    }
}
