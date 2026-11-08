package com.website.authservice.application.service;

import com.website.authservice.application.dto.AdminSession;
import com.website.authservice.application.util.TokenHashing;
import com.website.authservice.domain.entity.RefreshTokenEntity;
import com.website.authservice.domain.repository.RefreshTokenRepository;
import com.website.authservice.infrastructure.config.AppProperties;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final AppProperties appProperties;

    public RefreshTokenServiceImpl(RefreshTokenRepository refreshTokenRepository, AppProperties appProperties) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.appProperties = appProperties;
    }

    @Override
    @Transactional
    public String create(AdminSession session, String accessJti) {
        String raw = UUID.randomUUID() + "." + UUID.randomUUID();
        RefreshTokenEntity entity = new RefreshTokenEntity();
        entity.setId(UUID.randomUUID());
        entity.setTokenHash(TokenHashing.sha256Hex(raw));
        entity.setAdminUserId(session.userId());
        entity.setAccessJti(accessJti);
        entity.setExpiresAt(Instant.now().plusSeconds(appProperties.getJwt().getRefreshTtlSeconds()));
        refreshTokenRepository.save(entity);
        return raw;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RefreshTokenEntity> findValid(String refreshToken) {
        return refreshTokenRepository.findByTokenHash(TokenHashing.sha256Hex(refreshToken))
                .filter(token -> !token.isRevoked())
                .filter(token -> token.getExpiresAt().isAfter(Instant.now()));
    }

    @Override
    @Transactional
    public String rotate(RefreshTokenEntity existing, AdminSession session, String newAccessJti) {
        existing.setRevokedAt(Instant.now());
        refreshTokenRepository.save(existing);
        return create(session, newAccessJti);
    }

    @Override
    @Transactional
    public void revokeByAccessJti(String accessJti) {
        refreshTokenRepository.revokeByAccessJti(accessJti);
    }

    @Override
    @Transactional
    public void revokeAllForUser(UUID userId) {
        refreshTokenRepository.revokeAllForUser(userId);
    }
}
