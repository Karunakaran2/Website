package com.website.authservice.web.response;

public record AuthResponse(
        String accessToken,
        String tokenType,
        String username,
        String displayName,
        Long expiresIn,
        String refreshToken
) {
}
