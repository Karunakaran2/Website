package com.website.authservice.domain.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "admin_role_privilege")
public class AdminRolePrivilege {

    @EmbeddedId
    private AdminRolePrivilegeId id;

    protected AdminRolePrivilege() {
    }

    public AdminRolePrivilege(UUID roleId, String privilegeCode) {
        this.id = new AdminRolePrivilegeId(roleId, privilegeCode);
    }

    public AdminRolePrivilegeId getId() {
        return id;
    }
}