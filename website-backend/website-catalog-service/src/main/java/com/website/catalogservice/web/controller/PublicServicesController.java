package com.website.catalogservice.web.controller;

import com.website.catalogservice.domain.entity.Category;
import com.website.catalogservice.domain.repository.CategoryRepository;
import com.website.catalogservice.web.response.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/services")
@Tag(name = "Public catalog", description = "Service offerings")
public class PublicServicesController {

    private final CategoryRepository categoryRepository;

    public PublicServicesController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> list() {
        List<Map<String, Object>> items = categoryRepository
                .findByDeletedAtIsNullAndActiveStatusOrderByNameAsc("Y")
                .stream()
                .map(PublicServicesController::toDto)
                .toList();
        return ApiResponse.ok(items);
    }

    private static Map<String, Object> toDto(Category category) {
        return Map.of(
                "id", category.getId(),
                "name", category.getName(),
                "type", category.getType() != null ? category.getType() : ""
        );
    }
}