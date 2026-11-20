package com.website.catalogservice.domain.repository;

import com.website.catalogservice.domain.entity.Casestudy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CasestudyRepository extends JpaRepository<Casestudy, Long> {
}