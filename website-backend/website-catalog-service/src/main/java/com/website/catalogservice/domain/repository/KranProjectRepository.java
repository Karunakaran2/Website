package com.website.catalogservice.domain.repository;

import com.website.catalogservice.domain.entity.KranProject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KranProjectRepository extends JpaRepository<KranProject, Long> {
}