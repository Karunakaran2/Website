package com.website.authservice.domain.repository;

import com.website.authservice.domain.entity.RefreshTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, UUID> {

    Optional<RefreshTokenEntity> findByTokenHash(String tokenHash);

    @Modifying
    @Query("update RefreshTokenEntity r set r.revokedAt = CURRENT_TIMESTAMP where r.accessJti = :accessJti and r.revokedAt is null")
    void revokeByAccessJti(@Param("accessJti") String accessJti);

    @Modifying
    @Query("update RefreshTokenEntity r set r.revokedAt = CURRENT_TIMESTAMP where r.adminUserId = :userId and r.revokedAt is null")
    void revokeAllForUser(@Param("userId") UUID userId);
}
