package com.website.catalogservice.web.response;

import com.website.catalogservice.domain.entity.KranSolution;

public record SolutionResponse(
        Long id,
        String category,
        String title,
        String description,
        String imagePath,
        String activeStatus
) {

    public static SolutionResponse from(KranSolution solution) {
        return new SolutionResponse(
                solution.getId(),
                solution.getCategory(),
                solution.getTitle(),
                solution.getDescription(),
                solution.getImagePath(),
                solution.getActiveStatus()
        );
    }
}