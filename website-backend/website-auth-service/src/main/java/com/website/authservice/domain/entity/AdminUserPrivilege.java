package com.website.authservice.domain.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "admin_user_privilege")
public class AdminUserPrivilege {

    @EmbeddedId
    private AdminUserPrivilegeId id;

    protected AdminUserPrivilege() {
    }

    public AdminUserPrivilege(UUID adminUserId, String privilegeCode) {
        this.id = new AdminUserPrivilegeId(adminUserId, privilegeCode);
    }

    public AdminUserPrivilegeId getId() {
        return id;
    }
}