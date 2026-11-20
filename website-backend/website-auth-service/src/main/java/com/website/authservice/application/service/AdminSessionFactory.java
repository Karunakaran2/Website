package com.website.authservice.application.service;

import com.website.authservice.application.dto.AdminSession;
import com.website.authservice.domain.entity.AdminRole;
import com.website.authservice.domain.entity.AdminUser;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AdminSessionFactory {

    private final PrivilegeService privilegeService;

    public AdminSessionFactory(PrivilegeService privilegeService) {
        this.privilegeService = privilegeService;
    }

    public AdminSession fromUser(AdminUser user) {
        AdminRole role = privilegeService.resolveRole(user);
        List<String> privileges = privilegeService.effectivePrivilegeCodes(user);
        String roleCode = user.isSystemAdmin()
                ? "SYSTEM_ADMIN"
                : role != null ? role.getCode() : "UNASSIGNED";
        String roleName = user.isSystemAdmin()
                ? "System administrator"
                : role != null ? role.getName() : "Unassigned";
        String displayName = user.getDisplayName() != null && !user.getDisplayName().isBlank()
                ? user.getDisplayName()
                : user.getUsername();
        return new AdminSession(
                user.getId(),
                user.getUsername(),
                displayName,
                roleCode,
                roleName,
                privileges,
                user.isSystemAdmin()
        );
    }
}