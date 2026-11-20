package com.website.catalogservice.domain.repository;

import com.website.catalogservice.domain.entity.KranSolution;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KranSolutionRepository extends JpaRepository<KranSolution, Long> {

    List<KranSolution> findByDeletedAtIsNullAndActiveStatusOrderByTitleAsc(String activeStatus);
}