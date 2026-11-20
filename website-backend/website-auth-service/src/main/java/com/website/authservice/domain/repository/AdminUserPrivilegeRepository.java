package com.website.authservice.domain.repository;

import com.website.authservice.domain.entity.AdminUserPrivilege;
import com.website.authservice.domain.entity.AdminUserPrivilegeId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AdminUserPrivilegeRepository extends JpaRepository<AdminUserPrivilege, AdminUserPrivilegeId> {

    void deleteById_AdminUserId(UUID adminUserId);
}