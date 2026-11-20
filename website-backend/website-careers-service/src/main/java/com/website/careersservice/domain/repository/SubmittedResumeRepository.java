package com.website.careersservice.domain.repository;

import com.website.careersservice.domain.entity.SubmittedResume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmittedResumeRepository extends JpaRepository<SubmittedResume, Long> {

    List<SubmittedResume> findAllByOrderBySubmittedOnDesc();
}