package com.example.backend.user.repository;

import com.example.backend.user.entity.Provider;
import com.example.backend.user.entity.Role;
import com.example.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<User> findByProviderAndProviderId(Provider provider, String providerId);

//    List<User> findAllByRole(Role role);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.membership WHERE u.role = :role")
    List<User> findAllByRole(@Param("role") Role role);
}
