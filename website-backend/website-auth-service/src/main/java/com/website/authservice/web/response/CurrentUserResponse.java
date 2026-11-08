package com.website.authservice.web.response;

public record CurrentUserResponse(
        String username,
        String displayName,
        String role
) {
}
