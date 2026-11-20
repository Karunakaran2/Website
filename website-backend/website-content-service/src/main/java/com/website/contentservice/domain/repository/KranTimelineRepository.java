package com.website.contentservice.domain.repository;

import com.website.contentservice.domain.entity.KranTimeline;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KranTimelineRepository extends JpaRepository<KranTimeline, Long> {
}