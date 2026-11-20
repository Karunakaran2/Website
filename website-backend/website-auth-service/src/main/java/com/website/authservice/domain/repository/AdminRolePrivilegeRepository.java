package com.website.authservice.domain.repository;

import com.website.authservice.domain.entity.AdminRolePrivilege;
import com.website.authservice.domain.entity.AdminRolePrivilegeId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AdminRolePrivilegeRepository extends JpaRepository<AdminRolePrivilege, AdminRolePrivilegeId> {

    void deleteById_RoleId(UUID roleId);
}