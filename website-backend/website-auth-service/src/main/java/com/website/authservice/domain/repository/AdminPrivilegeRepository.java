package com.website.authservice.domain.repository;

import com.website.authservice.domain.entity.AdminPrivilege;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface AdminPrivilegeRepository extends JpaRepository<AdminPrivilege, String> {

    @Query(value = """
            SELECT p.code FROM admin_privilege p
            INNER JOIN admin_role_privilege rp ON rp.privilege_code = p.code
            WHERE rp.role_id = :roleId
            ORDER BY p.code
            """, nativeQuery = true)
    List<String> findCodesByRoleId(UUID roleId);

    @Query(value = """
            SELECT p.code FROM admin_privilege p
            INNER JOIN admin_user_privilege up ON up.privilege_code = p.code
            WHERE up.admin_user_id = :userId
            ORDER BY p.code
            """, nativeQuery = true)
    List<String> findCodesByUserId(UUID userId);
}