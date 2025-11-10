package com.example.backend.global.util;

import com.example.backend.branch.entity.Branch;
import com.example.backend.branch.entity.BranchType;
import com.example.backend.branch.repository.BranchRepository;
import com.example.backend.user.entity.Provider;
import com.example.backend.user.entity.Role;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import com.nimbusds.openid.connect.sdk.claims.UserInfo;
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
        createInitialBranches();
        Branch defaultBranch = createDefaultBranch();

        Branch gangnamBranch = branchRepository.findByBranchName("강남점")
                .orElseThrow(() -> new RuntimeException(" (AdminInitializer) "));
        // ADMIN 계정 생성
        createAdminUser(defaultBranch);

        // 필요시 테스트용 계정도 생성 가능

        // 기본 트레이너 두명 생성
        createTrainerUsers(gangnamBranch);

    }

    private void createInitialBranches() {
        List<BranchInfo> branches = List.of(
                new BranchInfo("강남점", "서울특별시 강남구", "02-123-1234"),
                new BranchInfo("해운대점", "부산광역시 해운대구", "051-123-1234"),
                new BranchInfo("홍대점", "서울특별시 마포구", "02-456-4567")
        );

        for (BranchInfo info: branches) {
            if (branchRepository.findByBranchName(info.name).isEmpty()){
                Branch branch = Branch.builder()
                        .branchName(info.name)
                        .location(info.location)
                        .phone(info.phone)
                        .type(BranchType.REGULAR)
                        .build();
                branchRepository.save(branch);
                log.info(" {} 지점이 생성되었습니다.", info.name);
            }else {
                log.info(" {} 지점이 이미 존재합니다.", info.name);
            }
        }
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

    private void createTrainerUsers(Branch branch) {
        final String TRAINER1_EMAIL = "trainer1@trainer.com";
        if (userRepository.findByEmail(TRAINER1_EMAIL).isEmpty()) {
            User trainer1 = User.builder()
                    .username("김종국")
                    .email(TRAINER1_EMAIL)
                    .password(passwordEncoder.encode("trainer1234"))
                    .provider(Provider.LOCAL)
                    .role(Role.TRAINER)
                    .branch(branch)
                    .build();
            userRepository.save(trainer1);
            log.info("✅ TRAINER 1 . (Name: 김종국, : {})", trainer1.getRealUsername(), branch.getBranchName());
        }

        // 2.
        final String TRAINER2_EMAIL = "trainer2@trainer.com";
        if (userRepository.findByEmail(TRAINER2_EMAIL).isEmpty()) {
            User trainer2 = User.builder()
                    .username("양치승")
                    .email(TRAINER2_EMAIL)
                    .password(passwordEncoder.encode("trainer1234"))
                    .provider(Provider.LOCAL)
                    .role(Role.TRAINER)
                    .branch(branch)
                    .build();
            userRepository.save(trainer2);
            log.info("✅ TRAINER 2 . (Name: 양치승, : {})", trainer2.getRealUsername(), branch.getBranchName());
        }
    }

    @RequiredArgsConstructor
    private static class BranchInfo {
        final String name;
        final String location;
        final String phone;
    }
}
