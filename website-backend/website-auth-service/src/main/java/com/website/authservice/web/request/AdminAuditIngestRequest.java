package com.website.authservice.web.request;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record AdminAuditIngestRequest(
        UUID actorUserId,
        @NotBlank String actorUsername,
        @NotBlank String action,
        @NotBlank String moduleKey,
        String entityType,
        String entityId,
        String summary,
        String ipAddress,
        String userAgent
) {
}