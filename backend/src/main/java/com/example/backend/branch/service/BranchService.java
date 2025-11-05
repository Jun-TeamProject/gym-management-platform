package com.example.backend.branch.service;

import com.example.backend.branch.dto.BranchRequest;
import com.example.backend.branch.dto.BranchResponse;
import com.example.backend.branch.entity.Branch;
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
                .build();
        return BranchResponse.of(branchRepository.save(branch));
    }

    // 2. 전체 지점 조회 (Read ALL)
    public List<BranchResponse> getAllBranches() {
        return branchRepository.findAll().stream()
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
        if (!branchRepository.existsById(id)) {
            throw new IllegalArgumentException("지점을 찾을 수 없습니다.");
        }
        branchRepository.deleteById(id);
    }



}
