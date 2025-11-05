package com.example.backend.membership.repository;

import com.example.backend.membership.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MembershipRepository extends JpaRepository<Membership, Long> {
    Optional<Membership> findByUserId(Long userId);
}
