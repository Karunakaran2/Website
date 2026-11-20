package com.website.authservice.domain.repository;

import com.website.authservice.domain.entity.AdminRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AdminRoleRepository extends JpaRepository<AdminRole, UUID> {
    Optional<AdminRole> findByCodeIgnoreCase(String code);
}