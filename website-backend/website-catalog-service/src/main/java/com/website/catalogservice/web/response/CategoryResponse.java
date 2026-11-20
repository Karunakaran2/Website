package com.website.catalogservice.web.response;

import com.website.catalogservice.domain.entity.Category;

public record CategoryResponse(Long id, String name, String type, String activeStatus) {

    public static CategoryResponse from(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getType(),
                category.getActiveStatus()
        );
    }
}