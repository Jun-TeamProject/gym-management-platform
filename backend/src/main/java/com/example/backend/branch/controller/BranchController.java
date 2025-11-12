package com.example.backend.branch.controller;

import com.example.backend.branch.dto.BranchRequest;
import com.example.backend.branch.dto.BranchResponse;
import com.example.backend.branch.service.BranchService;
import com.example.backend.user.dto.BranchDetailResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/branches")
public class BranchController {

    private final BranchService branchService;

    @GetMapping
    public ResponseEntity<List<BranchResponse>> getAllBranches() {
        //전체공개 - 지점선택(회원가입)
        List<BranchResponse> response = branchService.getAllBranches();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')") // ADMIN에서만 등록 가능
    public ResponseEntity<BranchResponse> createBranch(@RequestBody BranchRequest request){
        BranchResponse response = branchService.createBranch(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<BranchResponse> updateBranch(@PathVariable Long id, @RequestBody BranchRequest request) {
        BranchResponse response = branchService.updateBranch(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteBranch(@PathVariable Long id) {
        branchService.deleteBranch(id);
        return ResponseEntity.noContent().build();
    }

    //지점 소개용 정보 공개
    @GetMapping("/{id}")
    public ResponseEntity<BranchDetailResponse> getBranchDetails(@PathVariable Long id) {
        BranchDetailResponse response = branchService.getBranchDetails(id);
        return ResponseEntity.ok(response);
    }

    // 사진 업로드
    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> addFacilityImage(
            @PathVariable Long id,
            @RequestParam("image")MultipartFile file
            ) throws IOException {
        String imageUrl = branchService.addFacilityImage(id, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(imageUrl);
    }

    @DeleteMapping("/{id}/images")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteFacilityImage(
            @PathVariable("id") Long branchId,
            @RequestParam String imageUrl
    ){
        branchService.deleteFacilityImage(branchId, imageUrl);
        return ResponseEntity.noContent().build();
    }

}
