package com.website.catalogservice.domain.repository;

import com.website.catalogservice.domain.entity.ProjectProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectProductRepository extends JpaRepository<ProjectProduct, Long> {

    List<ProjectProduct> findByDeletedAtIsNullAndActiveStatusOrderByOrderNoAscIdAsc(String activeStatus);
}
