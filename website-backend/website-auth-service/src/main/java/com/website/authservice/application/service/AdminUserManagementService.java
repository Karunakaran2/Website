package com.website.authservice.application.service;

import com.website.authservice.application.dto.AdminSession;
import com.website.authservice.application.exception.ResourceNotFoundException;
import com.website.authservice.domain.entity.AdminRole;
import com.website.authservice.domain.entity.AdminUser;
import com.website.authservice.domain.entity.AdminUserPrivilege;
import com.website.authservice.domain.repository.AdminPrivilegeRepository;
import com.website.authservice.domain.repository.AdminRoleRepository;
import com.website.authservice.domain.repository.AdminUserPrivilegeRepository;
import com.website.authservice.domain.repository.AdminUserRepository;
import com.website.authservice.web.request.AdminUserUpsertRequest;
import com.website.authservice.web.response.AdminUserResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;

@Service
public class AdminUserManagementService {

    private final AdminUserRepository adminUserRepository;
    private final AdminRoleRepository adminRoleRepository;
    private final AdminUserPrivilegeRepository adminUserPrivilegeRepository;
    private final PasswordEncoder passwordEncoder;
    private final PrivilegeService privilegeService;
    private final AdminPrivilegeRepository adminPrivilegeRepository;
    private final AdminAccessGuard adminAccessGuard;

    public AdminUserManagementService(
            AdminUserRepository adminUserRepository,
            AdminRoleRepository adminRoleRepository,
            AdminUserPrivilegeRepository adminUserPrivilegeRepository,
            PasswordEncoder passwordEncoder,
            PrivilegeService privilegeService,
            AdminPrivilegeRepository adminPrivilegeRepository,
            AdminAccessGuard adminAccessGuard
    ) {
        this.adminUserRepository = adminUserRepository;
        this.adminRoleRepository = adminRoleRepository;
        this.adminUserPrivilegeRepository = adminUserPrivilegeRepository;
        this.passwordEncoder = passwordEncoder;
        this.privilegeService = privilegeService;
        this.adminPrivilegeRepository = adminPrivilegeRepository;
        this.adminAccessGuard = adminAccessGuard;
    }

    @Transactional(readOnly = true)
    public List<AdminUserResponse> list(AdminSession actor) {
        adminAccessGuard.requireUserManagement(actor);
        return adminUserRepository.findAll().stream()
                .sorted((a, b) -> a.getUsername().compareToIgnoreCase(b.getUsername()))
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AdminUserResponse create(AdminSession actor, AdminUserUpsertRequest request) {
        adminAccessGuard.requireUserManagement(actor);
        adminUserRepository.findByUsernameIgnoreCase(request.username().trim())
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Username already exists");
                });
        AdminUser user = new AdminUser();
        user.setId(UUID.randomUUID());
        apply(user, request, true);
        adminUserRepository.save(user);
        syncUserPrivileges(user, request);
        return toResponse(user);
    }

    @Transactional
    public AdminUserResponse update(AdminSession actor, UUID id, AdminUserUpsertRequest request) {
        adminAccessGuard.requireUserManagement(actor);
        AdminUser user = adminUserRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        apply(user, request, false);
        adminUserRepository.save(user);
        syncUserPrivileges(user, request);
        return toResponse(user);
    }

    @Transactional
    public void delete(AdminSession actor, UUID id) {
        adminAccessGuard.requireUserManagement(actor);
        if (actor.userId().equals(id)) {
            throw new IllegalArgumentException("You cannot delete your own account");
        }
        AdminUser user = adminUserRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        adminUserPrivilegeRepository.deleteById_AdminUserId(user.getId());
        adminUserRepository.delete(user);
    }

    private void apply(AdminUser user, AdminUserUpsertRequest request, boolean isCreate) {
        user.setUsername(request.username().trim());
        user.setDisplayName(StringUtils.hasText(request.displayName()) ? request.displayName().trim() : null);
        user.setActive(request.active() == null || request.active());
        user.setSystemAdmin(Boolean.TRUE.equals(request.systemAdmin()));
        user.setUseCustomPrivileges(Boolean.TRUE.equals(request.useCustomPrivileges()));
        if (request.roleId() != null) {
            adminRoleRepository.findById(request.roleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
            user.setRoleId(request.roleId());
        } else {
            user.setRoleId(null);
        }
        if (StringUtils.hasText(request.password())) {
            String password = request.password().trim();
            if (password.length() < 8) {
                throw new IllegalArgumentException("Password must be at least 8 characters");
            }
            if (password.length() > 128) {
                throw new IllegalArgumentException("Password must be at most 128 characters");
            }
            user.setPasswordHash(passwordEncoder.encode(password));
        } else if (isCreate) {
            throw new IllegalArgumentException("Password is required for new users");
        }
    }

    private void syncUserPrivileges(AdminUser user, AdminUserUpsertRequest request) {
        adminUserPrivilegeRepository.deleteById_AdminUserId(user.getId());
        if (!user.isUseCustomPrivileges() || request.privilegeCodes() == null) {
            return;
        }
        for (String code : request.privilegeCodes()) {
            if (StringUtils.hasText(code)) {
                adminUserPrivilegeRepository.save(new AdminUserPrivilege(user.getId(), code.trim()));
            }
        }
    }

    private AdminUserResponse toResponse(AdminUser user) {
        AdminRole role = privilegeService.resolveRole(user);
        List<String> effective = privilegeService.effectivePrivilegeCodes(user);
        List<String> custom = user.isUseCustomPrivileges()
                ? adminPrivilegeRepository.findCodesByUserId(user.getId())
                : List.of();
        return new AdminUserResponse(
                user.getId(),
                user.getUsername(),
                user.getDisplayName(),
                user.isActive(),
                user.isSystemAdmin(),
                user.isUseCustomPrivileges(),
                user.getRoleId(),
                role != null ? role.getCode() : null,
                role != null ? role.getName() : null,
                user.isUseCustomPrivileges() ? custom : effective,
                effective
        );
    }
}