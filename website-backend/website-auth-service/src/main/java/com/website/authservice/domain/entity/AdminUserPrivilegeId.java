package com.website.authservice.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class AdminUserPrivilegeId implements Serializable {

    @Column(name = "admin_user_id", nullable = false)
    private UUID adminUserId;

    @Column(name = "privilege_code", nullable = false, length = 96)
    private String privilegeCode;

    protected AdminUserPrivilegeId() {
    }

    public AdminUserPrivilegeId(UUID adminUserId, String privilegeCode) {
        this.adminUserId = adminUserId;
        this.privilegeCode = privilegeCode;
    }

    public UUID getAdminUserId() {
        return adminUserId;
    }

    public String getPrivilegeCode() {
        return privilegeCode;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AdminUserPrivilegeId that)) {
            return false;
        }
        return Objects.equals(adminUserId, that.adminUserId) && Objects.equals(privilegeCode, that.privilegeCode);
    }

    @Override
    public int hashCode() {
        return Objects.hash(adminUserId, privilegeCode);
    }
}