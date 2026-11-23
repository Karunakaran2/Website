package com.website.authservice.application.service;

import com.website.authservice.application.dto.AdminSession;
import com.website.authservice.domain.entity.AdminAuditEvent;
import com.website.authservice.domain.repository.AdminAuditEventRepository;
import com.website.authservice.web.request.AdminAuditIngestRequest;
import com.website.authservice.web.response.AdminAuditEventResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

@Service
public class AdminAuditService {

    private final AdminAuditEventRepository adminAuditEventRepository;
    private final AdminAccessGuard adminAccessGuard;

    public AdminAuditService(
            AdminAuditEventRepository adminAuditEventRepository,
            AdminAccessGuard adminAccessGuard
    ) {
        this.adminAuditEventRepository = adminAuditEventRepository;
        this.adminAccessGuard = adminAccessGuard;
    }

    @Transactional
    public void record(
            UUID actorUserId,
            String actorUsername,
            String action,
            String moduleKey,
            String entityType,
            String entityId,
            String summary,
            HttpServletRequest request
    ) {
        String ip = request != null ? resolveClientIp(request) : null;
        String userAgent = request != null ? request.getHeader("User-Agent") : null;
        record(actorUserId, actorUsername, action, moduleKey, entityType, entityId, summary, ip, userAgent);
    }

    @Transactional
    public void record(AdminSession actor, String action, String moduleKey, String entityType, String entityId,
                       String summary, HttpServletRequest request) {
        UUID actorId = actor != null ? actor.userId() : null;
        String username = actor != null ? actor.username() : "system";
        record(actorId, username, action, moduleKey, entityType, entityId, summary, request);
    }

    @Transactional
    public void recordIngest(AdminAuditIngestRequest body) {
        record(
                body.actorUserId(),
                body.actorUsername(),
                body.action(),
                body.moduleKey(),
                body.entityType(),
                body.entityId(),
                body.summary(),
                body.ipAddress(),
                body.userAgent()
        );
    }

    @Transactional
    public void record(
            UUID actorUserId,
            String actorUsername,
            String action,
            String moduleKey,
            String entityType,
            String entityId,
            String summary,
            String ipAddress,
            String userAgent
    ) {
        if (!StringUtils.hasText(actorUsername) || !StringUtils.hasText(action) || !StringUtils.hasText(moduleKey)) {
            return;
        }
        AdminAuditEvent event = new AdminAuditEvent();
        event.setActorUserId(actorUserId);
        event.setActorUsername(actorUsername.trim());
        event.setAction(action.trim().toUpperCase());
        event.setModuleKey(moduleKey.trim());
        event.setEntityType(entityType);
        event.setEntityId(entityId);
        event.setSummary(summary);
        event.setIpAddress(ipAddress);
        if (StringUtils.hasText(userAgent) && userAgent.length() > 512) {
            userAgent = userAgent.substring(0, 512);
        }
        event.setUserAgent(userAgent);
        adminAuditEventRepository.save(event);
    }

    @Transactional(readOnly = true)
    public Page<AdminAuditEventResponse> search(
            AdminSession actor,
            String moduleKey,
            String username,
            Instant from,
            Instant to,
            int page,
            int size
    ) {
        adminAccessGuard.requireAuditView(actor);
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 200);
        Pageable pageable = PageRequest.of(safePage, safeSize);
        boolean filterModule = StringUtils.hasText(moduleKey);
        String module = filterModule ? moduleKey.trim() : "";
        boolean filterUsername = StringUtils.hasText(username);
        String usernamePattern = filterUsername
                ? "%" + username.trim().toLowerCase(Locale.ROOT) + "%"
                : "";
        boolean filterFrom = from != null;
        boolean filterTo = to != null;
        Instant fromInstant = filterFrom ? from : Instant.EPOCH;
        Instant toInstant = filterTo ? to : Instant.now();
        return adminAuditEventRepository.search(
                filterModule,
                module,
                filterUsername,
                usernamePattern,
                filterFrom,
                fromInstant,
                filterTo,
                toInstant,
                pageable
        ).map(this::toResponse);
    }

    private AdminAuditEventResponse toResponse(AdminAuditEvent event) {
        return new AdminAuditEventResponse(
                event.getId(),
                event.getOccurredAt(),
                event.getActorUserId(),
                event.getActorUsername(),
                event.getAction(),
                event.getModuleKey(),
                event.getEntityType(),
                event.getEntityId(),
                event.getSummary(),
                event.getIpAddress()
        );
    }

    private static String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(forwarded)) {
            int comma = forwarded.indexOf(',');
            return comma > 0 ? forwarded.substring(0, comma).trim() : forwarded.trim();
        }
        return request.getRemoteAddr();
    }
}