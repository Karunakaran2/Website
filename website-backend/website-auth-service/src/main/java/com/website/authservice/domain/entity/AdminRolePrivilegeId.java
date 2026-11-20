package com.website.authservice.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class AdminRolePrivilegeId implements Serializable {

    @Column(name = "role_id", nullable = false)
    private UUID roleId;

    @Column(name = "privilege_code", nullable = false, length = 96)
    private String privilegeCode;

    protected AdminRolePrivilegeId() {
    }

    public AdminRolePrivilegeId(UUID roleId, String privilegeCode) {
        this.roleId = roleId;
        this.privilegeCode = privilegeCode;
    }

    public UUID getRoleId() {
        return roleId;
    }

    public String getPrivilegeCode() {
        return privilegeCode;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AdminRolePrivilegeId that)) {
            return false;
        }
        return Objects.equals(roleId, that.roleId) && Objects.equals(privilegeCode, that.privilegeCode);
    }

    @Override
    public int hashCode() {
        return Objects.hash(roleId, privilegeCode);
    }
}