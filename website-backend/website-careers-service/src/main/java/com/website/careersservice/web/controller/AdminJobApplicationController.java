package com.website.careersservice.web.controller;

import com.website.careersservice.domain.repository.ApplicationRequestRepository;
import com.website.careersservice.web.response.ApiResponse;
import com.website.careersservice.web.response.JobApplicationResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/job-applications")
@Tag(name = "Admin careers", description = "Read-only job application inbox")
public class AdminJobApplicationController {

    private final ApplicationRequestRepository applicationRequestRepository;

    public AdminJobApplicationController(ApplicationRequestRepository applicationRequestRepository) {
        this.applicationRequestRepository = applicationRequestRepository;
    }

    @GetMapping
    public ApiResponse<List<JobApplicationResponse>> list() {
        List<JobApplicationResponse> items = applicationRequestRepository.findAllWithCareerOrderBySubmittedOnDesc()
                .stream()
                .map(JobApplicationResponse::from)
                .toList();
        return ApiResponse.ok(items);
    }
}