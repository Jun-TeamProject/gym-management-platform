package com.example.backend.user.entity;

import com.example.backend.membership.dto.MembershipDto;
import com.example.backend.membership.entity.Membership;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_email", columnList = "email"),
        @Index(name = "idx_username", columnList = "username")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = true)
    private String password;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(length = 255)
    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    private Provider provider;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String providerId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    private boolean enabled;

    @Column(length = 100)
    private String fullName;

    @Column(unique = true, length = 20)
    private String phoneNumber;

    private String bio;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private LocalDate birthdate;

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonManagedReference
    private Membership membership;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority(this.role.getKey()));
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    public String getRealUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @PrePersist
    protected void onCreate() { enabled = true; }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
