package com.website.catalogservice.web.request;

public record SolutionUpsertRequest(
        String category,
        String title,
        String description,
        String imagePath,
        String activeStatus
) {
}