package com.website.authservice.application.service;

import com.website.authservice.application.dto.AdminSession;
import com.website.authservice.application.util.AuthMessages;
import com.website.authservice.application.util.PrivilegeCodes;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.stereotype.Component;

@Component
public class AdminAccessGuard {

    public void requireAny(AdminSession session, String... privilegeCodes) {
        if (session == null) {
            throw new BadCredentialsException(AuthMessages.INVALID_SESSION);
        }
        if (session.systemAdmin()) {
            return;
        }
        for (String code : privilegeCodes) {
            if (session.privileges() != null && session.privileges().contains(code)) {
                return;
            }
        }
        throw new InsufficientAuthenticationException("Insufficient privileges");
    }

    public void requireUserManagement(AdminSession session) {
        requireAny(session, PrivilegeCodes.ADMIN_USERS_MANAGE);
    }

    public void requireRoleManagement(AdminSession session) {
        requireAny(session, PrivilegeCodes.ADMIN_ROLES_MANAGE);
    }
}