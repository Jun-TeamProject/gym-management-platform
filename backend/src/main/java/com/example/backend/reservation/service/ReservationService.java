package com.example.backend.reservation.service;

import com.example.backend.reservation.dto.ReservationRequest;
import com.example.backend.reservation.dto.ReservationResponse;
import com.example.backend.reservation.entity.Reservation;
import com.example.backend.reservation.repository.ReservationRepository;
import com.example.backend.user.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.user.repository.UserRepository;
import com.example.backend.user.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;

    public ReservationResponse createReservation(ReservationRequest request) {

        User currentUser = authenticationService.getCurrentUser();

        Optional<User> trainer = userRepository.findById(request.getTrainerId());

        Reservation reservation = Reservation.builder()
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(request.getStatus())
                .memo(request.getMemo())
                .member(currentUser)
                .trainer(trainer.get())
                .build();

        reservation = reservationRepository.save(reservation);
        return ReservationResponse.fromEntity(reservation);
    }

    // 전체 예약 확인(GET)
    @Transactional(readOnly = true)
    public Page<ReservationResponse> getAllReservations(Pageable pageable) {
        Page<Reservation> reservations = reservationRepository.findAll(pageable);

        return reservations.map(ReservationResponse::fromEntity);
    }

    // 특정 예약 확인
    @Transactional(readOnly = true)
    public ReservationResponse getReservation(Long reservationId) {
        User currentUser = authenticationService.getCurrentUser();

        // 예약 존재 여부 확인
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        // 해당 예약의 회원(member) 또는 트레이너(trainer)만 접근 가능
        if (!reservation.getMember().getId().equals(currentUser.getId()) &&
                !reservation.getTrainer().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to view this reservation");
        }

        return ReservationResponse.fromEntity(reservation);
    }


    // 회원 입장 예약 확인
    @Transactional(readOnly = true)
    public Page<ReservationResponse> getMemberReservations(Long userId, Pageable pageable) {
        Page<Reservation> reservations = reservationRepository.findByMemberId(userId, pageable);

        return reservations.map(ReservationResponse::fromEntity);
    }

    // 트레이너 입장 예약 확인
    @Transactional(readOnly = true)
    public Page<ReservationResponse> getTrainerReservations(Long userId, Pageable pageable) {
        Page<Reservation> reservations = reservationRepository.findByTrainerId(userId, pageable);

        return reservations.map(ReservationResponse::fromEntity);
    }

    // 예약 수정
    public ReservationResponse updateReservation(Long reservationId, ReservationRequest request) {
        User currentUser = authenticationService.getCurrentUser();

        Optional<User> trainer = userRepository.findById(request.getTrainerId());

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        if (!reservation.getMember().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to update this Reservation");
        }

        reservation.setStartTime(request.getStartTime());
        reservation.setEndTime(request.getEndTime());
        reservation.setStatus(request.getStatus());
        reservation.setMemo(request.getMemo());
        reservation.setTrainer(trainer.get());

        reservation = reservationRepository.save(reservation);
        return ReservationResponse.fromEntity(reservation);
    }

    // 예약 삭제
    public void deleteReservation(Long reservationId) {
        User currentUser = authenticationService.getCurrentUser();
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        if (!reservation.getMember().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to update this reservation");
        }

        reservationRepository.deleteById(reservationId);
    }
}
