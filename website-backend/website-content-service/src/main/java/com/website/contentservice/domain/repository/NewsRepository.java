package com.website.contentservice.domain.repository;

import com.website.contentservice.domain.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NewsRepository extends JpaRepository<News, Long> {

    List<News> findByDeletedAtIsNullAndActiveStatusOrderByPublishDateDesc(String activeStatus);
}
