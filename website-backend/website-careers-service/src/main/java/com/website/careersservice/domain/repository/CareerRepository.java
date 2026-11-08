package com.website.careersservice.domain.repository;

import com.website.careersservice.domain.entity.Career;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CareerRepository extends JpaRepository<Career, Long> {

    List<Career> findByDeletedAtIsNullAndActiveStatusOrderByPostedOnDesc(String activeStatus);
}
