package com.website.authservice.web.controller;

import com.website.authservice.application.service.AdminRoleManagementService;
import com.website.authservice.application.service.PrivilegeService;
import com.website.authservice.application.service.RequestAdminSessionService;
import com.website.authservice.web.request.AdminRoleUpsertRequest;
import com.website.authservice.web.response.AdminRoleResponse;
import com.website.authservice.web.response.ApiResponse;
import com.website.authservice.web.response.PrivilegeResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Admin roles", description = "CMS roles and privileges")
@SecurityRequirement(name = "bearerAuth")
public class AdminRoleController {

    private final AdminRoleManagementService adminRoleManagementService;
    private final PrivilegeService privilegeService;
    private final RequestAdminSessionService requestAdminSessionService;

    public AdminRoleController(
            AdminRoleManagementService adminRoleManagementService,
            PrivilegeService privilegeService,
            RequestAdminSessionService requestAdminSessionService
    ) {
        this.adminRoleManagementService = adminRoleManagementService;
        this.privilegeService = privilegeService;
        this.requestAdminSessionService = requestAdminSessionService;
    }

    @GetMapping("/roles")
    public ApiResponse<List<AdminRoleResponse>> listRoles(HttpServletRequest request) {
        var session = requestAdminSessionService.requireSession(request);
        return ApiResponse.ok(adminRoleManagementService.list(session));
    }

    @PostMapping("/roles")
    public ApiResponse<AdminRoleResponse> createRole(
            HttpServletRequest request,
            @Valid @RequestBody AdminRoleUpsertRequest body
    ) {
        var session = requestAdminSessionService.requireSession(request);
        return ApiResponse.ok(adminRoleManagementService.create(session, body));
    }

    @PutMapping("/roles/{id}")
    public ApiResponse<AdminRoleResponse> updateRole(
            HttpServletRequest request,
            @PathVariable UUID id,
            @Valid @RequestBody AdminRoleUpsertRequest body
    ) {
        var session = requestAdminSessionService.requireSession(request);
        return ApiResponse.ok(adminRoleManagementService.update(session, id, body));
    }

    @GetMapping("/privileges")
    public ApiResponse<List<PrivilegeResponse>> listPrivileges(HttpServletRequest request) {
        requestAdminSessionService.requireSession(request);
        List<PrivilegeResponse> items = privilegeService.listCatalog().stream()
                .map(p -> new PrivilegeResponse(p.getCode(), p.getName(), p.getModuleKey(), p.getAction()))
                .toList();
        return ApiResponse.ok(items);
    }
}