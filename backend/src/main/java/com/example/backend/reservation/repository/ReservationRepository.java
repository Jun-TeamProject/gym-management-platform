package com.example.backend.reservation.repository;

import com.example.backend.reservation.entity.Reservation;
import io.lettuce.core.dynamic.annotation.Param;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Optional;


public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @EntityGraph(attributePaths = {"member", "trainer", "member.branch", "trainer.branch"})
    Page<Reservation> findByMemberId(Long id, Pageable pageable);

    @EntityGraph(attributePaths = {"member", "trainer", "member.branch", "trainer.branch"})
    Page<Reservation> findByTrainerId(Long id, Pageable pageable);

    @Query("SELECT COUNT(r) > 0 FROM Reservation r " +
    "WHERE r.trainer.id = :trainerId " +
    "AND r.status != 'CANCELED' " +
    "AND r.startTime < :endTime " +
    "AND r.endTime > :startTime ")
    boolean existsOverlappingReservation (
            @Param("trainerId") Long  trainerId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

}
