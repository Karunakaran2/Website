package com.website.authservice.application.dto;

import java.util.UUID;

public record AdminSession(UUID userId, String username, String displayName) {
}
