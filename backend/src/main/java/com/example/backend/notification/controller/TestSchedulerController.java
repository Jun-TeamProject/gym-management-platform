package com.example.backend.notification.controller;

import com.example.backend.notification.service.MembershipExpiryScheduler;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestSchedulerController {
    private final MembershipExpiryScheduler membershipExpiryScheduler;

    @GetMapping("/run-scheduler")
    public ResponseEntity<String> runScheduler() {
        try {
            membershipExpiryScheduler.checkAndSendExpiryNotification();
            return ResponseEntity.ok("이용권 만료 스케줄러 수동 실행 성공");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("이용권 만료 스케줄러 수동 실행 실패: " + e.getMessage());
        }
    }

    @GetMapping("/run-pt-scheduler")
    public ResponseEntity<String> runPtScheduler() {
        try {
            membershipExpiryScheduler.checkAndSendPtCountNotification();
            return ResponseEntity.ok("PT 횟수 스케줄러 수동 실행 성공");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("PT 횟수 스케줄러 수동 실행 실패: " + e.getMessage());
        }
    }
}
