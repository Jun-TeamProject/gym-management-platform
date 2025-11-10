package com.example.backend.reservation.controller;

import com.example.backend.reservation.dto.ReservationRequest;
import com.example.backend.reservation.dto.ReservationResponse;
import com.example.backend.reservation.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(
            @Valid @RequestBody ReservationRequest request
    ) {
        ReservationResponse response = reservationService.createReservation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<ReservationResponse>> getAllReservations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReservationResponse> reservations = reservationService.getAllReservations(pageable);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/{reservationId}")
    public ResponseEntity<ReservationResponse> getReservation(
            @PathVariable Long reservationId
    ) {
        ReservationResponse response = reservationService.getReservation(reservationId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/member/{userId}")
    public ResponseEntity<Page<ReservationResponse>> getMemberReservations(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReservationResponse> reservations = reservationService.getMemberReservations(userId, pageable);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/trainer/{userId}")
    public ResponseEntity<Page<ReservationResponse>> getTrainerReservations(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReservationResponse> reservations = reservationService.getTrainerReservations(userId, pageable);
        return ResponseEntity.ok(reservations);
    }

    @PutMapping("/{reservationId}")
    public ResponseEntity<ReservationResponse> updateReservation(
            @PathVariable Long reservationId,
            @Valid @RequestBody ReservationRequest request
    ) {
        ReservationResponse response = reservationService.updateReservation(reservationId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{reservationId}/confirm")
    @PreAuthorize("hasAuthority('TRAINER')")
    public ResponseEntity<ReservationResponse> confirmReservation(
            @PathVariable Long reservationId
    ){
        ReservationResponse response = reservationService.confirmReservation(reservationId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{reservationId}")
    public ResponseEntity<Void> deleteReservation(
            @PathVariable Long reservationId
    ) {
        reservationService.deleteReservation(reservationId);
        return ResponseEntity.noContent().build();
    }
}
