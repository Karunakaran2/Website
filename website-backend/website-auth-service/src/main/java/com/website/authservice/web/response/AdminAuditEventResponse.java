package com.website.authservice.web.response;

import java.time.Instant;
import java.util.UUID;

public record AdminAuditEventResponse(
        Long id,
        Instant occurredAt,
        UUID actorUserId,
        String actorUsername,
        String action,
        String moduleKey,
        String entityType,
        String entityId,
        String summary,
        String ipAddress
) {
}