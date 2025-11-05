package com.example.backend.user.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {
    USER("ROLE_USER", "일반 회원"),
    TRAINER("ROLE_TRAINER", "트레이너"),
    ADMIN("ROLE_ADMIN", "관리자");

    private final String key;
    private final String title;
}
