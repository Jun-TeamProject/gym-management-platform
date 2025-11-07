package com.example.backend.reservation.service;

import com.example.backend.reservation.dto.ReservationRequest;
import com.example.backend.reservation.dto.ReservationResponse;
import com.example.backend.reservation.entity.Reservation;
import com.example.backend.reservation.repository.ReservationRepository;
import com.example.backend.user.entity.Role;
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

        // 트레이너 존재 확인
        User trainer = userRepository.findById(request.getTrainerId())
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found"));

        // 트레이너 권한 확인
        if (trainer.getRole() != Role.TRAINER) {
            throw new UnauthorizedException("Selected user is not a trainer");
        }

        // 일반 회원만 예약 생성 가능하도록 제한
        if (currentUser.getRole() != Role.MEMBER && currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only members can create reservations");
        }

        Reservation reservation = Reservation.builder()
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(request.getStatus())
                .memo(request.getMemo())
                .member(currentUser)
                .trainer(trainer)
                .build();

        reservation = reservationRepository.save(reservation);
        return ReservationResponse.fromEntity(reservation);
    }

    // 전체 예약 확인. 관리자 기능
    @Transactional(readOnly = true)
    public Page<ReservationResponse> getAllReservations(Pageable pageable) {
        User currentUser = authenticationService.getCurrentUser();

        if (currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only admins can view all reservations");
        }

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

        // 관리자거나, 예약의 member 혹은 trainer일 경우만 허용
        if (!isAdminOrRelatedUser(currentUser, reservation)) {
            throw new UnauthorizedException("You are not authorized to view this reservation");
        }

        return ReservationResponse.fromEntity(reservation);
    }

    // 회원 입장 예약 확인
    @Transactional(readOnly = true)
    public Page<ReservationResponse> getMemberReservations(Long userId, Pageable pageable) {
        User currentUser = authenticationService.getCurrentUser();

        if (currentUser.getRole() == Role.MEMBER && !currentUser.getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to view other members' reservations");
        }

        if (currentUser.getRole() != Role.ADMIN && currentUser.getRole() != Role.MEMBER) {
            throw new UnauthorizedException("Only members or admins can view member reservations");
        }

        Page<Reservation> reservations = reservationRepository.findByMemberId(userId, pageable);
        return reservations.map(ReservationResponse::fromEntity);
    }


    // 트레이너 입장 예약 확인
    @Transactional(readOnly = true)
    public Page<ReservationResponse> getTrainerReservations(Long userId, Pageable pageable) {
        User currentUser = authenticationService.getCurrentUser();

        if (currentUser.getRole() == Role.TRAINER && !currentUser.getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to view other trainers' reservations");
        }

        if (currentUser.getRole() != Role.ADMIN && currentUser.getRole() != Role.TRAINER) {
            throw new UnauthorizedException("Only trainers or admins can view trainer reservations");
        }

        Page<Reservation> reservations = reservationRepository.findByTrainerId(userId, pageable);
        return reservations.map(ReservationResponse::fromEntity);
    }


    // 예약 수정
    public ReservationResponse updateReservation(Long reservationId, ReservationRequest request) {
        User currentUser = authenticationService.getCurrentUser();

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        if (!isAdminOrRelatedUser(currentUser, reservation)) {
            throw new UnauthorizedException("You are not authorized to update this reservation");
        }

        // 변경할 트레이너 확인
        User trainer = userRepository.findById(request.getTrainerId())
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found"));

        if (trainer.getRole() != Role.TRAINER) {
            throw new UnauthorizedException("Selected user is not a trainer");
        }

        reservation.setStartTime(request.getStartTime());
        reservation.setEndTime(request.getEndTime());
        reservation.setStatus(request.getStatus());
        reservation.setMemo(request.getMemo());
        reservation.setTrainer(trainer);

        reservation = reservationRepository.save(reservation);
        return ReservationResponse.fromEntity(reservation);
    }

    // 예약 삭제
    public void deleteReservation(Long reservationId) {
        User currentUser = authenticationService.getCurrentUser();

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        if (!isAdminOrRelatedUser(currentUser, reservation)) {
            throw new UnauthorizedException("You are not authorized to delete this reservation");
        }

        reservationRepository.deleteById(reservationId);
    }

    private boolean isAdminOrRelatedUser(User currentUser, Reservation reservation) {
        return currentUser.getRole() == Role.ADMIN ||
                reservation.getMember().getId().equals(currentUser.getId()) ||
                reservation.getTrainer().getId().equals(currentUser.getId());
    }
}
