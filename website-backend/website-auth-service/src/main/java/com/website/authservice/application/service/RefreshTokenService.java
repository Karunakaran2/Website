package com.website.authservice.application.service;

import com.website.authservice.application.dto.AdminSession;
import com.website.authservice.domain.entity.RefreshTokenEntity;

import java.util.Optional;

public interface RefreshTokenService {

    String create(AdminSession session, String accessJti);

    Optional<RefreshTokenEntity> findValid(String refreshToken);

    String rotate(RefreshTokenEntity existing, AdminSession session, String newAccessJti);

    void revokeByAccessJti(String accessJti);

    void revokeAllForUser(java.util.UUID userId);
}
