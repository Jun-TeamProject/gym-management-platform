package com.example.backend.membership.repository;

import com.example.backend.membership.entity.Membership;
import com.example.backend.product.entity.Product.ProductType;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MembershipRepository extends JpaRepository<Membership, Long> {

    @Query("SELECT m FROM Membership m " +
            "WHERE m.user.id = :userId " +
            "AND m.product.type = :productType " +
            "AND m.status = 'ACTIVE'")
    Optional<Membership> findActiveMembershipByUserIdAndType(
            @Param("userId") Long userId,
            @Param("productType") ProductType productType
    );
    
    @Query("""
            SELECT m FROM Membership m
            JOIN FETCH m.product
            WHERE m.user.id = :userId
            """
            )
    List<Membership> findAllByUserIdWithProduct(@Param("userId") Long userId);

    List<Membership> findByEndDateAndStatus(LocalDate endDate, Membership.MembershipStatus status);
    List<Membership> findByPtCountRemainingAndStatus(int count, Membership.MembershipStatus status);
    List<Membership> findByUserIdAndStatus(Long userId, Membership.MembershipStatus status);
}
