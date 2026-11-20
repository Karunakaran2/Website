package com.website.contentservice.domain.repository;

import com.website.contentservice.domain.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Long> {

    List<Banner> findByDeletedAtIsNullAndActiveStatusOrderByOrderNoAscIdAsc(String activeStatus);
}