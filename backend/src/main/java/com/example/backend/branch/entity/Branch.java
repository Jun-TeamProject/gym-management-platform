package com.example.backend.branch.entity;

import com.example.backend.user.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table (name = "T_BRANCH")
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA 필수
@AllArgsConstructor
@Builder
public class Branch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String branchName; // 지점 이름

    private String location; // 지점 주소
    private String phone; // 연락처

    @OneToMany(mappedBy = "branch")
    @Builder.Default
    @JsonIgnore
    private List<User> users = new ArrayList<>();
}
