package com.website.authservice.web.response;

import java.util.List;

public record CurrentUserResponse(
        String username,
        String displayName,
        String role,
        String roleName,
        List<String> privilegeCodes,
        boolean systemAdmin
) {
}