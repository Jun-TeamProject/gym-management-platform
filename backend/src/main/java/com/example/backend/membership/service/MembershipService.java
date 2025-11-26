package com.example.backend.membership.service;

import com.example.backend.membership.dto.MembershipDto;
import com.example.backend.membership.entity.Membership;
import com.example.backend.membership.repository.MembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MembershipService {

    private final MembershipRepository membershipRepository;

    @Transactional(readOnly = true)
    public List<MembershipDto> getMembershipsByUserId(Long userId) {
        List<Membership> memberships =
                membershipRepository.findAllByUserIdWithProduct(userId);

        return memberships.stream()
                .map(MembershipDto::fromEntity)
                .toList();
    }
}
