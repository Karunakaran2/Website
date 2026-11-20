package com.website.authservice.application.dto;

import java.util.List;
import java.util.UUID;

public record AdminSession(
        UUID userId,
        String username,
        String displayName,
        String roleCode,
        String roleName,
        List<String> privileges,
        boolean systemAdmin
) {
}