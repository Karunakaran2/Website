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
    private final CaptchaService captchaService;
    private final AdminSessionFactory adminSessionFactory;
    private final AdminAuditService adminAuditService;

    public AuthServiceImpl(
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder,
            JwtAccessTokenService jwtAccessTokenService,
            CaptchaService captchaService,
            AdminSessionFactory adminSessionFactory,
            AdminAuditService adminAuditService
    ) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtAccessTokenService = jwtAccessTokenService;
        this.captchaService = captchaService;
        this.adminSessionFactory = adminSessionFactory;
        this.adminAuditService = adminAuditService;
    }

    @Override
    @Transactional
    public AuthResponse login(
            String username,
            String password,
            String captchaId,
            String captcha,
            HttpServletRequest request
    ) {
        captchaService.validateAndConsume(captchaId, captcha);
        String normalizedUsername = username.trim();
        var userOpt = adminUserRepository.findByUsernameIgnoreCase(normalizedUsername);
        if (userOpt.isEmpty()) {
            adminAuditService.record(
                    null,
                    normalizedUsername,
                    "LOGIN_FAILED",
                    "auth",
                    "admin_user",
                    null,
                    "Login failed — unknown username",
                    request
            );
            throw new BadCredentialsException(AuthMessages.INVALID_USERNAME_OR_PASSWORD);
        }
        AdminUser user = userOpt.get();
        if (!user.isActive()) {
            adminAuditService.record(
                    user.getId(),
                    user.getUsername(),
                    "LOGIN_FAILED",
                    "auth",
                    "admin_user",
                    user.getId().toString(),
                    "Login blocked — account deactivated",
                    request
            );
            throw new DisabledException(AuthMessages.ACCOUNT_DISABLED);
        }
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            adminAuditService.record(
                    user.getId(),
                    user.getUsername(),
                    "LOGIN_FAILED",
                    "auth",
                    "admin_user",
                    user.getId().toString(),
                    "Login failed — invalid password",
                    request
            );
            throw new BadCredentialsException(AuthMessages.INVALID_USERNAME_OR_PASSWORD);
        }
        user.setLastLoginAt(Instant.now());
        adminUserRepository.save(user);
        AdminSession session = adminSessionFactory.fromUser(user);
        adminAuditService.record(
                session,
                "LOGIN",
                "auth",
                "admin_user",
                user.getId().toString(),
                "Successful login",
                request
        );
        return toAuthResponse(jwtAccessTokenService.issue(session), session);
    }

    @Override
    public AuthResponse refresh(String refreshToken) {
        IssuedTokens tokens = jwtAccessTokenService.refresh(refreshToken);
        AdminSession session = jwtAccessTokenService.read(tokens.accessToken())
                .orElseThrow(() -> new BadCredentialsException(AuthMessages.INVALID_SESSION));
        return toAuthResponse(tokens, session);
    }

    @Override
    public void logout(HttpServletRequest request) {
        extractBearer(request).ifPresent(token -> {
            jwtAccessTokenService.read(token).ifPresent(session -> adminAuditService.record(
                    session,
                    "LOGOUT",
                    "auth",
                    "admin_user",
                    session.userId().toString(),
                    "User signed out",
                    request
            ));
            jwtAccessTokenService.revoke(token);
        });
    }

    @Override
    public CurrentUserResponse currentUser(HttpServletRequest request) {
        AdminSession session = extractBearer(request)
                .flatMap(jwtAccessTokenService::read)
                .orElseThrow(() -> new BadCredentialsException(AuthMessages.INVALID_SESSION));
        return new CurrentUserResponse(
                session.username(),
                session.displayName(),
                session.roleCode(),
                session.roleName(),
                session.privileges(),
                session.systemAdmin()
        );
    }

    @Override
    @Transactional
    public void changePassword(HttpServletRequest request, String currentPassword, String newPassword) {
        AdminSession session = extractBearer(request)
                .flatMap(jwtAccessTokenService::read)
                .orElseThrow(() -> new BadCredentialsException(AuthMessages.INVALID_SESSION));
        AdminUser user = adminUserRepository.findById(session.userId())
                .orElseThrow(() -> new BadCredentialsException(AuthMessages.INVALID_SESSION));
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        String next = newPassword == null ? "" : newPassword.trim();
        if (next.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters");
        }
        if (passwordEncoder.matches(next, user.getPasswordHash())) {
            throw new IllegalArgumentException("New password must be different from the current password");
        }
        user.setPasswordHash(passwordEncoder.encode(next));
        adminUserRepository.save(user);
        adminAuditService.record(
                session,
                "PASSWORD_CHANGE",
                "auth",
                "admin_user",
                user.getId().toString(),
                "Password changed",
                request
        );
    }

    private AuthResponse toAuthResponse(IssuedTokens tokens, AdminSession session) {
        return new AuthResponse(
                tokens.accessToken(),
                "Bearer",
                session.username(),
                session.displayName(),
                tokens.expiresInSeconds(),
                tokens.refreshToken(),
                session.roleCode(),
                session.roleName(),
                session.privileges(),
                session.systemAdmin()
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
