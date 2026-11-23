package com.website.authservice.web.controller;

import com.website.authservice.application.service.AdminAuditService;
import com.website.authservice.application.service.RequestAdminSessionService;
import com.website.authservice.web.response.AdminAuditEventResponse;
import com.website.authservice.web.response.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/v1/admin/audit-events")
@Tag(name = "Admin audit", description = "CMS audit trail")
@SecurityRequirement(name = "bearerAuth")
public class AdminAuditController {

    private final AdminAuditService adminAuditService;
    private final RequestAdminSessionService requestAdminSessionService;

    public AdminAuditController(
            AdminAuditService adminAuditService,
            RequestAdminSessionService requestAdminSessionService
    ) {
        this.adminAuditService = adminAuditService;
        this.requestAdminSessionService = requestAdminSessionService;
    }

    @GetMapping
    public ApiResponse<Page<AdminAuditEventResponse>> list(
            HttpServletRequest request,
            @RequestParam(required = false) String module,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size
    ) {
        var session = requestAdminSessionService.requireSession(request);
        return ApiResponse.ok(adminAuditService.search(session, module, username, from, to, page, size));
    }
}