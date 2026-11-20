package com.website.careersservice.web.controller;

import com.website.careersservice.domain.repository.SubmittedResumeRepository;
import com.website.careersservice.web.response.ApiResponse;
import com.website.careersservice.web.response.SubmittedResumeResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/submitted-resumes")
@Tag(name = "Admin careers", description = "Read-only general resume submissions")
public class AdminSubmittedResumeController {

    private final SubmittedResumeRepository submittedResumeRepository;

    public AdminSubmittedResumeController(SubmittedResumeRepository submittedResumeRepository) {
        this.submittedResumeRepository = submittedResumeRepository;
    }

    @GetMapping
    public ApiResponse<List<SubmittedResumeResponse>> list() {
        List<SubmittedResumeResponse> items = submittedResumeRepository.findAllByOrderBySubmittedOnDesc()
                .stream()
                .map(SubmittedResumeResponse::from)
                .toList();
        return ApiResponse.ok(items);
    }
}