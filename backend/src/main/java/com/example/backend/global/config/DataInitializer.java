package com.example.backend.global.config;

import com.example.backend.branch.entity.Branch;
import com.example.backend.branch.repository.BranchRepository;
import com.example.backend.user.entity.Provider;
import com.example.backend.user.entity.Role;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        Branch defaultBranch;
        if (branchRepository.count() == 0) {
            defaultBranch = Branch.builder()
                    .branchName("본점")
                    .location("서울시")
                    .phone("02-000-0000")
                    .build();
            branchRepository.save(defaultBranch);
            log.info("Default branch '본점' created.");
        } else {
            defaultBranch = branchRepository.findAll().get(0);
        }

        if (userRepository.findAllByRole(Role.ADMIN).isEmpty()) {
            User adminUser = User.builder()
                    .email("admin@admin.com")
                    .username("admin")
                    .password(passwordEncoder.encode("password"))
                    .fullName("관리자")
                    .role(Role.ADMIN)
                    .provider(Provider.LOCAL)
                    .branch(defaultBranch)
                    .build();
            userRepository.save(adminUser);
        }
    }
}
