package com.website.catalogservice.domain.repository;

import com.website.catalogservice.domain.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByDeletedAtIsNullAndActiveStatusOrderByNameAsc(String activeStatus);
}