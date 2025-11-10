package com.example.backend.notification.service;

import com.example.backend.membership.entity.Membership;
import com.example.backend.membership.repository.MembershipRepository;
import com.example.backend.notification.dto.NotificationResponse;
import com.example.backend.notification.entity.Notification;
import com.example.backend.notification.entity.NotificationType;
import com.example.backend.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MembershipExpiryScheduler {
    private final MembershipRepository membershipRepository;
    private final NotificationRepository notificationRepository;
    private final SseEmitterService sseEmitterService;

    private static final List<Integer> NOTIFICATION_DAYS_BEFORE = List.of(7, 3, 1);
    private static final List<Integer> NOTIFICATION_COUNTS_REMAINING = List.of(5, 1);

    @Scheduled(cron = "0 0 1 * * *")
    @Transactional
    public void checkAndSendExpiryNotification() {
        log.info("이용권 만료 스케줄러 시작");

        for (int daysLeft : NOTIFICATION_DAYS_BEFORE) {
            sendNotificationForDaysLeft(daysLeft);
        }

        log.info("이용권 만료 알림 스케줄러 종료");
    }

    private void sendNotificationForDaysLeft(int daysLeft) {
        LocalDate targetEndDate = LocalDate.now().plusDays(daysLeft);

        List<Membership> expiringMemberships = membershipRepository.findByEndDateAndStatus(
                targetEndDate,
                Membership.MembershipStatus.ACTIVE
        );

        if (expiringMemberships.isEmpty()) {
            log.info("{}일 뒤 만료되는 이용권이 없습니다. (Target Date: {})", daysLeft, targetEndDate);
            return;
        }

        log.info("{}일 뒤 만료되는 이용권 {}권 발견 (Target Date: {})", daysLeft, expiringMemberships.size(), targetEndDate);

        for (Membership membership : expiringMemberships) {
            String message = String.format(
                    "회원님의 '%s'이 %d일 뒤(%s) 만료될 예정입니다.",
                    membership.getProduct().getName(),
                    daysLeft,
                    targetEndDate
            );

            Notification notification = Notification.builder()
                    .user(membership.getUser())
                    .message(message)
                    .isRead(false)
                    .type(NotificationType.MEMBERSHIP_EXPIRY)
                    .build();

            Notification savedNotification = notificationRepository.save(notification);

            NotificationResponse response = NotificationResponse.fromEntity(savedNotification);
            sseEmitterService.sendToUser(membership.getUser().getId(), response);
        }
    }

    @Scheduled(cron = "0 5 1 * * *")
    @Transactional
    public void checkAndSendPtCountNotification() {
        log.info("PT 횟수 알림 스케줄러 시작");

        for (int countLeft : NOTIFICATION_COUNTS_REMAINING) {
            sendNotificationForCountsLeft(countLeft);
        }

        log.info("PT 횟수 알림 스케줄러 종료");
    }

    private void sendNotificationForCountsLeft(int countLeft) {
        List<Membership> expiringMemberships = membershipRepository.findByPtCountRemainingAndStatus(
                countLeft,
                Membership.MembershipStatus.ACTIVE
        );

        if (expiringMemberships.isEmpty()) {
            log.info("{}회 남은 PT 이용권이 없습니다.", countLeft);
            return;
        }

        log.info("{}회 남은 PT 이용권 {}권 발견", countLeft, expiringMemberships.size());

        for (Membership membership : expiringMemberships) {
            String message = String.format(
                    "회원님의 '%s'이 %d회 남았습니다.",
                    membership.getProduct().getName(),
                    countLeft
            );

            Notification notification = Notification.builder()
                    .user(membership.getUser())
                    .message(message)
                    .isRead(false)
                    .type(NotificationType.MEMBERSHIP_EXPIRY)
                    .build();

            Notification savedNotification = notificationRepository.save(notification);

            NotificationResponse response = NotificationResponse.fromEntity(savedNotification);
            sseEmitterService.sendToUser(membership.getUser().getId(), response);
        }
    }
}
