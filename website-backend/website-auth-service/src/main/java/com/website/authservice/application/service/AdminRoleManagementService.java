package com.website.authservice.application.service;

import com.website.authservice.application.dto.AdminSession;
import com.website.authservice.application.exception.ResourceNotFoundException;
import com.website.authservice.domain.entity.AdminRole;
import com.website.authservice.domain.entity.AdminRolePrivilege;
import com.website.authservice.domain.repository.AdminRolePrivilegeRepository;
import com.website.authservice.domain.repository.AdminRoleRepository;
import com.website.authservice.web.request.AdminRoleUpsertRequest;
import com.website.authservice.web.response.AdminRoleResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;

@Service
public class AdminRoleManagementService {

    private final AdminRoleRepository adminRoleRepository;
    private final AdminRolePrivilegeRepository adminRolePrivilegeRepository;
    private final PrivilegeService privilegeService;
    private final AdminAccessGuard adminAccessGuard;

    public AdminRoleManagementService(
            AdminRoleRepository adminRoleRepository,
            AdminRolePrivilegeRepository adminRolePrivilegeRepository,
            PrivilegeService privilegeService,
            AdminAccessGuard adminAccessGuard
    ) {
        this.adminRoleRepository = adminRoleRepository;
        this.adminRolePrivilegeRepository = adminRolePrivilegeRepository;
        this.privilegeService = privilegeService;
        this.adminAccessGuard = adminAccessGuard;
    }

    @Transactional(readOnly = true)
    public List<AdminRoleResponse> list(AdminSession actor) {
        adminAccessGuard.requireRoleManagement(actor);
        return adminRoleRepository.findAll().stream()
                .sorted((a, b) -> a.getName().compareToIgnoreCase(b.getName()))
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AdminRoleResponse create(AdminSession actor, AdminRoleUpsertRequest request) {
        adminAccessGuard.requireRoleManagement(actor);
        AdminRole role = new AdminRole();
        role.setId(UUID.randomUUID());
        role.setCode(request.code().trim().toUpperCase());
        role.setName(request.name().trim());
        role.setDescription(request.description());
        role.setBuiltIn(false);
        adminRoleRepository.save(role);
        syncPrivileges(role.getId(), request.privilegeCodes());
        return toResponse(role);
    }

    @Transactional
    public AdminRoleResponse update(AdminSession actor, UUID id, AdminRoleUpsertRequest request) {
        adminAccessGuard.requireRoleManagement(actor);
        AdminRole role = adminRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        role.setName(request.name().trim());
        role.setDescription(request.description());
        if (!role.isBuiltIn() && StringUtils.hasText(request.code())) {
            role.setCode(request.code().trim().toUpperCase());
        }
        adminRoleRepository.save(role);
        syncPrivileges(role.getId(), request.privilegeCodes());
        return toResponse(role);
    }

    private void syncPrivileges(UUID roleId, List<String> privilegeCodes) {
        adminRolePrivilegeRepository.deleteById_RoleId(roleId);
        if (privilegeCodes == null) {
            return;
        }
        for (String code : privilegeCodes) {
            if (StringUtils.hasText(code)) {
                adminRolePrivilegeRepository.save(new AdminRolePrivilege(roleId, code.trim()));
            }
        }
    }

    private AdminRoleResponse toResponse(AdminRole role) {
        return new AdminRoleResponse(
                role.getId(),
                role.getCode(),
                role.getName(),
                role.getDescription(),
                role.isBuiltIn(),
                privilegeService.privilegeCodesForRole(role.getId())
        );
    }
}