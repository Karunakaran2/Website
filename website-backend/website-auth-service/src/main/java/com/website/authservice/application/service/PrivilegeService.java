package com.website.authservice.application.service;

import com.website.authservice.domain.entity.AdminPrivilege;
import com.website.authservice.domain.entity.AdminRole;
import com.website.authservice.domain.entity.AdminUser;
import com.website.authservice.domain.repository.AdminPrivilegeRepository;
import com.website.authservice.domain.repository.AdminRoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class PrivilegeService {

    private final AdminPrivilegeRepository adminPrivilegeRepository;
    private final AdminRoleRepository adminRoleRepository;

    public PrivilegeService(
            AdminPrivilegeRepository adminPrivilegeRepository,
            AdminRoleRepository adminRoleRepository
    ) {
        this.adminPrivilegeRepository = adminPrivilegeRepository;
        this.adminRoleRepository = adminRoleRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminPrivilege> listCatalog() {
        return adminPrivilegeRepository.findAll().stream()
                .sorted(Comparator.comparing(AdminPrivilege::getModuleKey)
                        .thenComparing(AdminPrivilege::getAction))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<String> effectivePrivilegeCodes(AdminUser user) {
        if (user.isSystemAdmin()) {
            return adminPrivilegeRepository.findAll().stream()
                    .map(AdminPrivilege::getCode)
                    .sorted()
                    .toList();
        }
        if (user.isUseCustomPrivileges()) {
            return adminPrivilegeRepository.findCodesByUserId(user.getId());
        }
        if (user.getRoleId() == null) {
            return List.of();
        }
        return adminPrivilegeRepository.findCodesByRoleId(user.getRoleId());
    }

    @Transactional(readOnly = true)
    public AdminRole resolveRole(AdminUser user) {
        if (user.getRoleId() == null) {
            return null;
        }
        return adminRoleRepository.findById(user.getRoleId()).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<String> privilegeCodesForRole(UUID roleId) {
        return adminPrivilegeRepository.findCodesByRoleId(roleId);
    }

    public static List<String> mergeAuthorities(List<String> privileges) {
        List<String> merged = new ArrayList<>();
        merged.add(com.website.authservice.application.util.JwtClaimNames.ROLE_ADMIN);
        if (privileges != null) {
            for (String code : privileges) {
                if (code != null && !code.isBlank()) {
                    merged.add(code.trim());
                }
            }
        }
        return merged;
    }
}