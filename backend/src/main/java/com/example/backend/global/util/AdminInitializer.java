package com.example.backend.global.util;

import com.example.backend.branch.entity.Branch;
import com.example.backend.branch.entity.BranchType;
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

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        Branch defaultBranch = createDefaultBranch();
        // ADMIN 계정 생성
        createAdminUser(defaultBranch);

        // 필요시 테스트용 계정도 생성 가능
    }

    private Branch createDefaultBranch() {
        List<Branch> defaultBranchList = branchRepository.findAllByType(BranchType.DEFAULT_BRANCH);

        if (defaultBranchList.isEmpty()) {
            Branch defaultBranch = Branch.builder()
                    .branchName("본점")
                    .location("서울시")
                    .phone("010-0000-0000")
                    .type(BranchType.DEFAULT_BRANCH)
                    .build();

            branchRepository.save(defaultBranch);
            log.info("Default branch가 생성되었습니다.");

            return defaultBranch;
        } else {
            return defaultBranchList.get(0);
        }
    }

    private void createAdminUser(Branch defaultBranch) {
        final String ADMIN_EMAIL = "admin@admin.com";

        if (userRepository.findAllByRole(Role.ADMIN).isEmpty()) {
            if (userRepository.existsByEmail(ADMIN_EMAIL) || userRepository.existsByUsername("admin")) {
                log.info("ADMIN 계정은 존재하지 않으나, ADMIN email 혹은 username이 이미 존재합니다.");
                return;
            }

            User adminUser = User.builder()
                    .username("admin")
                    .email(ADMIN_EMAIL)
                    .password(passwordEncoder.encode("admin1234"))
                    .provider(Provider.LOCAL)
                    .branch(defaultBranch)
                    .role(Role.ADMIN)
                    .build();

            userRepository.save(adminUser);
            log.info("ADMIN 계정이 생성되었습니다. (Email: {}, PW: admin1234)", ADMIN_EMAIL);
        } else {
            log.info("ADMIN 계정이 이미 존재합니다. (Email: {}", ADMIN_EMAIL);
        }
    }
}
