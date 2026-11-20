package com.website.authservice.application.service;

import com.website.authservice.application.dto.AdminSession;
import com.website.authservice.application.util.AuthMessages;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class RequestAdminSessionService {

    private final JwtAccessTokenService jwtAccessTokenService;

    public RequestAdminSessionService(JwtAccessTokenService jwtAccessTokenService) {
        this.jwtAccessTokenService = jwtAccessTokenService;
    }

    public AdminSession requireSession(HttpServletRequest request) {
        return extractBearer(request)
                .flatMap(jwtAccessTokenService::read)
                .orElseThrow(() -> new BadCredentialsException(AuthMessages.INVALID_SESSION));
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