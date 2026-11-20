package com.website.mediaservice.domain.repository;

import com.website.mediaservice.domain.entity.Gallery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GalleryRepository extends JpaRepository<Gallery, Long> {
}