package com.website.catalogservice.web.controller;

import com.website.catalogservice.domain.entity.KranSolution;
import com.website.catalogservice.domain.repository.KranSolutionRepository;
import com.website.catalogservice.web.response.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/solutions")
@Tag(name = "Public catalog", description = "Solutions catalog")
public class PublicSolutionsController {

    private final KranSolutionRepository solutionRepository;

    public PublicSolutionsController(KranSolutionRepository solutionRepository) {
        this.solutionRepository = solutionRepository;
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> list() {
        List<Map<String, Object>> items = solutionRepository
                .findByDeletedAtIsNullAndActiveStatusOrderByTitleAsc("Y")
                .stream()
                .map(PublicSolutionsController::toDto)
                .toList();
        return ApiResponse.ok(items);
    }

    private static Map<String, Object> toDto(KranSolution solution) {
        return Map.of(
                "id", solution.getId(),
                "title", solution.getTitle() != null ? solution.getTitle() : "",
                "category", solution.getCategory() != null ? solution.getCategory() : "",
                "description", solution.getDescription() != null ? solution.getDescription() : "",
                "imagePath", solution.getImagePath() != null ? solution.getImagePath() : ""
        );
    }
}