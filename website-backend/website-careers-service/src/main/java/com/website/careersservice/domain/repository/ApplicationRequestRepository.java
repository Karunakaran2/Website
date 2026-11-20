package com.website.careersservice.domain.repository;

import com.website.careersservice.domain.entity.ApplicationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ApplicationRequestRepository extends JpaRepository<ApplicationRequest, Long> {

    @Query("SELECT ar FROM ApplicationRequest ar LEFT JOIN FETCH ar.career ORDER BY ar.submittedOn DESC")
    List<ApplicationRequest> findAllWithCareerOrderBySubmittedOnDesc();
}