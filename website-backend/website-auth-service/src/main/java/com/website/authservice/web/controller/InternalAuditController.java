package com.website.authservice.web.controller;

import com.website.authservice.application.service.AdminAuditService;
import com.website.authservice.web.request.AdminAuditIngestRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/internal/audit-events")
public class InternalAuditController {

    private final AdminAuditService adminAuditService;
    private final String ingestSecret;

    public InternalAuditController(
            AdminAuditService adminAuditService,
            @Value("${website.audit.ingest-secret:}") String ingestSecret
    ) {
        this.adminAuditService = adminAuditService;
        this.ingestSecret = ingestSecret == null ? "" : ingestSecret.trim();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void ingest(
            @RequestHeader(value = "X-Website-Audit-Ingest-Secret", required = false) String secret,
            @Valid @RequestBody AdminAuditIngestRequest body
    ) {
        if (!ingestSecret.isEmpty() && !ingestSecret.equals(secret)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid audit ingest secret");
        }
        if (ingestSecret.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Audit ingest is not configured");
        }
        adminAuditService.recordIngest(body);
    }
}