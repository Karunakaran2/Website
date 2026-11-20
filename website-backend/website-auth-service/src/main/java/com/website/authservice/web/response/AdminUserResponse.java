package com.website.authservice.web.response;

import java.util.List;
import java.util.UUID;

public record AdminUserResponse(
        UUID id,
        String username,
        String displayName,
        boolean active,
        boolean systemAdmin,
        boolean useCustomPrivileges,
        UUID roleId,
        String roleCode,
        String roleName,
        List<String> privilegeCodes,
        List<String> effectivePrivilegeCodes
) {
}