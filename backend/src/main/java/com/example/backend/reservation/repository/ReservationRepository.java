package com.example.backend.reservation.repository;

import com.example.backend.reservation.entity.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @EntityGraph(attributePaths = {"member", "trainer"})
    Page<Reservation> findByMemberId(Long id, Pageable pageable);

    @EntityGraph(attributePaths = {"member", "trainer"})
    Page<Reservation> findByTrainerId(Long id, Pageable pageable);

}
