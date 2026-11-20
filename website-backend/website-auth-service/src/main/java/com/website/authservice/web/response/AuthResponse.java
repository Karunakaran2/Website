package com.website.authservice.web.response;

import java.util.List;

public record AuthResponse(
        String accessToken,
        String tokenType,
        String username,
        String displayName,
        Long expiresIn,
        String refreshToken,
        String role,
        String roleName,
        List<String> privilegeCodes,
        boolean systemAdmin
) {
}