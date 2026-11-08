package com.website.authservice.application.service;

import com.website.authservice.application.dto.AdminSession;
import com.website.authservice.application.dto.IssuedTokens;
import com.website.authservice.application.util.AuthMessages;
import com.website.authservice.application.util.JwtClaimNames;
import com.website.authservice.domain.entity.RefreshTokenEntity;
import com.website.authservice.domain.repository.AdminUserRepository;
import com.website.authservice.infrastructure.config.AppProperties;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class JwtAccessTokenServiceImpl implements JwtAccessTokenService {

    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;
    private final AppProperties appProperties;
    private final RefreshTokenService refreshTokenService;
    private final JwtRevocationService jwtRevocationService;
    private final AdminUserRepository adminUserRepository;

    public JwtAccessTokenServiceImpl(
            JwtEncoder jwtEncoder,
            JwtDecoder jwtDecoder,
            AppProperties appProperties,
            RefreshTokenService refreshTokenService,
            JwtRevocationService jwtRevocationService,
            AdminUserRepository adminUserRepository
    ) {
        this.jwtEncoder = jwtEncoder;
        this.jwtDecoder = jwtDecoder;
        this.appProperties = appProperties;
        this.refreshTokenService = refreshTokenService;
        this.jwtRevocationService = jwtRevocationService;
        this.adminUserRepository = adminUserRepository;
    }

    @Override
    public IssuedTokens issue(AdminSession session) {
        String jti = UUID.randomUUID().toString();
        String accessToken = encode(session, jti);
        String refreshToken = refreshTokenService.create(session, jti);
        return new IssuedTokens(
                accessToken,
                refreshToken,
                appProperties.getJwt().getAccessTtlSeconds(),
                jti
        );
    }

    @Override
    public IssuedTokens refresh(String refreshToken) {
        RefreshTokenEntity stored = refreshTokenService.findValid(refreshToken)
                .orElseThrow(() -> new BadCredentialsException(AuthMessages.INVALID_SESSION));
        AdminSession session = adminUserRepository.findById(stored.getAdminUserId())
                .map(user -> new AdminSession(user.getId(), user.getUsername(), user.getDisplayName()))
                .orElseThrow(() -> new BadCredentialsException(AuthMessages.INVALID_SESSION));
        String jti = UUID.randomUUID().toString();
        String accessToken = encode(session, jti);
        String rotatedRefresh = refreshTokenService.rotate(stored, session, jti);
        return new IssuedTokens(
                accessToken,
                rotatedRefresh,
                appProperties.getJwt().getAccessTtlSeconds(),
                jti
        );
    }

    @Override
    public Optional<AdminSession> read(String accessToken) {
        return decode(accessToken).flatMap(this::toSession);
    }

    @Override
    public void revoke(String accessToken) {
        decode(accessToken).ifPresent(jwt -> {
            jwtRevocationService.revokeAccessJti(jwt.getId(), jwt.getExpiresAt());
            refreshTokenService.revokeByAccessJti(jwt.getId());
        });
    }

    private String encode(AdminSession session, String jti) {
        Instant issuedAt = Instant.now();
        Instant expiresAt = issuedAt.plusSeconds(appProperties.getJwt().getAccessTtlSeconds());
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(appProperties.getJwt().getIssuer())
                .subject(session.userId().toString())
                .issuedAt(issuedAt)
                .expiresAt(expiresAt)
                .id(jti)
                .claim(JwtClaimNames.AUTHORITIES, List.of(JwtClaimNames.ROLE_ADMIN))
                .claim(JwtClaimNames.USERNAME, session.username())
                .claim(JwtClaimNames.DISPLAY_NAME, session.displayName())
                .build();
        JwsHeader header = JwsHeader.with(SignatureAlgorithm.RS256)
                .keyId(JwtClaimNames.KEY_ID)
                .build();
        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }

    private Optional<Jwt> decode(String accessToken) {
        if (!StringUtils.hasText(accessToken)) {
            return Optional.empty();
        }
        try {
            return Optional.of(jwtDecoder.decode(accessToken.trim()));
        } catch (JwtException exception) {
            return Optional.empty();
        }
    }

    private Optional<AdminSession> toSession(Jwt jwt) {
        try {
            UUID userId = UUID.fromString(jwt.getSubject());
            String username = jwt.getClaimAsString(JwtClaimNames.USERNAME);
            String displayName = jwt.getClaimAsString(JwtClaimNames.DISPLAY_NAME);
            return Optional.of(new AdminSession(userId, username, displayName));
        } catch (IllegalArgumentException exception) {
            return Optional.empty();
        }
    }
}
