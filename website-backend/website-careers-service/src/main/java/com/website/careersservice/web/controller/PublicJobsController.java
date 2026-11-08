package com.website.careersservice.web.controller;

import com.website.careersservice.domain.entity.Career;
import com.website.careersservice.domain.repository.CareerRepository;
import com.website.careersservice.web.response.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/jobs")
@Tag(name = "Public careers")
public class PublicJobsController {

    private final CareerRepository careerRepository;

    public PublicJobsController(CareerRepository careerRepository) {
        this.careerRepository = careerRepository;
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> list() {
        List<Map<String, Object>> jobs = careerRepository
                .findByDeletedAtIsNullAndActiveStatusOrderByPostedOnDesc("Y")
                .stream()
                .map(PublicJobsController::toDto)
                .toList();
        return ApiResponse.ok(jobs);
    }

    private static Map<String, Object> toDto(Career career) {
        return Map.ofEntries(
                Map.entry("id", career.getId()),
                Map.entry("title", career.getTitle() != null ? career.getTitle() : ""),
                Map.entry("jobDescription", career.getJobDescription() != null ? career.getJobDescription() : ""),
                Map.entry("skillSet", career.getSkillSet() != null ? career.getSkillSet() : ""),
                Map.entry("location", career.getLocation() != null ? career.getLocation() : ""),
                Map.entry("experience", career.getExperience() != null ? career.getExperience() : "")
        );
    }
}
