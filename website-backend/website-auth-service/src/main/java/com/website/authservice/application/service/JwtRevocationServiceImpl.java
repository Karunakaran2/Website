package com.website.authservice.application.service;

import com.website.authservice.application.util.JwtClaimNames;
import com.website.authservice.infrastructure.config.AppProperties;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.time.Instant;

@Service
public class JwtRevocationServiceImpl implements JwtRevocationService {

    private final StringRedisTemplate stringRedisTemplate;
    private final AppProperties appProperties;

    public JwtRevocationServiceImpl(StringRedisTemplate stringRedisTemplate, AppProperties appProperties) {
        this.stringRedisTemplate = stringRedisTemplate;
        this.appProperties = appProperties;
    }

    @Override
    public void revokeAccessJti(String jti, Instant expiresAt) {
        if (!StringUtils.hasText(jti)) {
            return;
        }
        Duration ttl = remainingTtl(expiresAt);
        if (ttl.isZero() || ttl.isNegative()) {
            return;
        }
        stringRedisTemplate.opsForValue().set(JwtClaimNames.REVOKE_PREFIX + jti.trim(), "1", ttl);
    }

    private Duration remainingTtl(Instant expiresAt) {
        if (expiresAt == null) {
            return Duration.ofSeconds(appProperties.getJwt().getAccessTtlSeconds());
        }
        Duration remaining = Duration.between(Instant.now(), expiresAt);
        if (remaining.isNegative()) {
            return Duration.ZERO;
        }
        return remaining;
    }
}
