package com.example.backend.notification.service;

import com.example.backend.notification.dto.NotificationResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class SseEmitterService {
    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe(Long userId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE / 2);

        emitters.put(userId, emitter);

        emitter.onCompletion(() -> {
            log.info("Emitter completed for user: {}", userId);
            emitters.remove(userId);
        });
        emitter.onTimeout(() -> {
            log.info("Emitter timed out for user: {}", userId);
            emitters.remove(userId);
        });
        emitter.onError((e) -> {
            log.error("Emitter error for user: {}", userId, e);
            emitters.remove(userId);
        });

        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("SSE 연결 성공"));
        } catch (IOException e) {
            log.error("SSE 연결 실패, user: {}", userId, e);
            emitters.remove(userId);
        }

        return emitter;
    }

    public void sendToUser(Long userId, NotificationResponse response) {
        SseEmitter emitter = emitters.get(userId);

        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("newNotification")
                        .data(response, MediaType.APPLICATION_JSON));

                log.info("user에게 알림 전송, user: {}", userId);
            } catch (IOException e) {
                log.error("user에게 알림 전송 실패, user: {}", userId, e);
                emitters.remove(userId);
            }
        } else {
            log.warn("활성화된 SseEmitter 찾을 수 없음, user: {}", userId);
        }
    }
}
