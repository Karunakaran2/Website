package com.website.authservice.web.controller;

import com.website.authservice.application.service.AdminUserManagementService;
import com.website.authservice.application.service.RequestAdminSessionService;
import com.website.authservice.web.request.AdminUserUpsertRequest;
import com.website.authservice.web.response.AdminUserResponse;
import com.website.authservice.web.response.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/users")
@Tag(name = "Admin users", description = "CMS user setup")
@SecurityRequirement(name = "bearerAuth")
public class AdminUserController {

    private final AdminUserManagementService adminUserManagementService;
    private final RequestAdminSessionService requestAdminSessionService;

    public AdminUserController(
            AdminUserManagementService adminUserManagementService,
            RequestAdminSessionService requestAdminSessionService
    ) {
        this.adminUserManagementService = adminUserManagementService;
        this.requestAdminSessionService = requestAdminSessionService;
    }

    @GetMapping
    public ApiResponse<List<AdminUserResponse>> list(HttpServletRequest request) {
        var session = requestAdminSessionService.requireSession(request);
        return ApiResponse.ok(adminUserManagementService.list(session));
    }

    @PostMapping
    public ApiResponse<AdminUserResponse> create(
            HttpServletRequest request,
            @Valid @RequestBody AdminUserUpsertRequest body
    ) {
        var session = requestAdminSessionService.requireSession(request);
        return ApiResponse.ok(adminUserManagementService.create(session, body));
    }

    @PutMapping("/{id}")
    public ApiResponse<AdminUserResponse> update(
            HttpServletRequest request,
            @PathVariable UUID id,
            @Valid @RequestBody AdminUserUpsertRequest body
    ) {
        var session = requestAdminSessionService.requireSession(request);
        return ApiResponse.ok(adminUserManagementService.update(session, id, body));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(HttpServletRequest request, @PathVariable UUID id) {
        var session = requestAdminSessionService.requireSession(request);
        adminUserManagementService.delete(session, id);
    }
}