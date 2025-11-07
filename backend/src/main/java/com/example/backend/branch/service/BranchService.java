package com.example.backend.branch.service;

import com.example.backend.branch.dto.BranchRequest;
import com.example.backend.branch.dto.BranchResponse;
import com.example.backend.branch.entity.Branch;
import com.example.backend.branch.entity.BranchType;
import com.example.backend.branch.repository.BranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BranchService {

    private final BranchRepository branchRepository;

    // 1. 지점 등록 (Create)
    public BranchResponse createBranch(BranchRequest request) {
        Branch branch = Branch.builder()
                .branchName(request.getBranchName())
                .location(request.getLocation())
                .phone(request.getPhone())
                .type(BranchType.REGULAR)
                .build();
        return BranchResponse.of(branchRepository.save(branch));
    }

    // 2. 전체 지점 조회 (Read ALL)
    public List<BranchResponse> getAllBranches() {
        return branchRepository.findAllByType(BranchType.REGULAR).stream()
                .map(BranchResponse::of)
                .collect(Collectors.toList());
    }

    //3. 지점 수정 (Update)
    @Transactional
    public BranchResponse updateBranch (Long id, BranchRequest request) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("지점을 찾을 수 없습니다."));

        branch.setBranchName(request.getBranchName());
        branch.setLocation(request.getLocation());
        branch.setPhone(request.getPhone());

        return BranchResponse.of(branch);
    }

    //4. 지점 삭제 (Delete)
    @Transactional
    public void deleteBranch(Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("지점을 찾을 수 없습니다."));

        if (branch.getType() == BranchType.DEFAULT_BRANCH) {
            throw new IllegalArgumentException("본점은 삭제할 수 없습니다.");
        }

        if (!branch.getUsers().isEmpty()) {
            throw new IllegalArgumentException("회원이 존재하는 지점은 삭제할 수 없습니다.");
        }

        branchRepository.delete(branch);
    }



}
