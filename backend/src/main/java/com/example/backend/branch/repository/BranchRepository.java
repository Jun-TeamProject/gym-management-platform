package com.example.backend.branch.repository;

import com.example.backend.branch.entity.Branch;
import com.example.backend.branch.entity.BranchType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {
    List<Branch> findAllByType(BranchType type);
}
