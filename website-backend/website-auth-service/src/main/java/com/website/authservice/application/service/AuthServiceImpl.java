package com.website.authservice.application.service;

import com.website.authservice.application.dto.AdminSession;
import com.website.authservice.application.dto.IssuedTokens;
import com.website.authservice.application.util.AuthMessages;
import com.website.authservice.application.util.JwtClaimNames;
import com.website.authservice.domain.entity.AdminUser;
import com.website.authservice.domain.repository.AdminUserRepository;
import com.website.authservice.web.response.AuthResponse;
import com.website.authservice.web.response.CurrentUserResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;

@Service
public class AuthServiceImpl implements AuthService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtAccessTokenService jwtAccessTokenService;

    public AuthServiceImpl(
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder,
            JwtAccessTokenService jwtAccessTokenService
    ) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtAccessTokenService = jwtAccessTokenService;
    }

    @Override
    @Transactional
    public AuthResponse login(String username, String password, HttpServletRequest request) {
        AdminUser user = adminUserRepository.findByUsernameIgnoreCase(username.trim())
                .orElseThrow(() -> new BadCredentialsException(AuthMessages.INVALID_USERNAME_OR_PASSWORD));
        if (!user.isActive()) {
            throw new DisabledException(AuthMessages.ACCOUNT_DISABLED);
        }
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new BadCredentialsException(AuthMessages.INVALID_USERNAME_OR_PASSWORD);
        }
        user.setLastLoginAt(Instant.now());
        adminUserRepository.save(user);
        AdminSession session = new AdminSession(
                user.getId(),
                user.getUsername(),
                StringUtils.hasText(user.getDisplayName()) ? user.getDisplayName() : user.getUsername()
        );
        return toAuthResponse(jwtAccessTokenService.issue(session));
    }

    @Override
    public AuthResponse refresh(String refreshToken) {
        return toAuthResponse(jwtAccessTokenService.refresh(refreshToken));
    }

    @Override
    public void logout(HttpServletRequest request) {
        extractBearer(request).ifPresent(jwtAccessTokenService::revoke);
    }

    @Override
    public CurrentUserResponse currentUser(HttpServletRequest request) {
        AdminSession session = extractBearer(request)
                .flatMap(jwtAccessTokenService::read)
                .orElseThrow(() -> new BadCredentialsException(AuthMessages.INVALID_SESSION));
        return new CurrentUserResponse(
                session.username(),
                session.displayName(),
                JwtClaimNames.ROLE_ADMIN
        );
    }

    private AuthResponse toAuthResponse(IssuedTokens tokens) {
        AdminSession session = jwtAccessTokenService.read(tokens.accessToken())
                .orElseThrow(() -> new BadCredentialsException(AuthMessages.INVALID_SESSION));
        return new AuthResponse(
                tokens.accessToken(),
                "Bearer",
                session.username(),
                session.displayName(),
                tokens.expiresInSeconds(),
                tokens.refreshToken()
        );
    }

    private java.util.Optional<String> extractBearer(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (!StringUtils.hasText(header) || !header.regionMatches(true, 0, "Bearer ", 0, 7)) {
            return java.util.Optional.empty();
        }
        String token = header.substring(7).trim();
        return StringUtils.hasText(token) ? java.util.Optional.of(token) : java.util.Optional.empty();
    }
}
