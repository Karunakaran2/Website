package com.website.catalogservice.web.controller;

import com.website.catalogservice.domain.entity.ProjectProduct;
import com.website.catalogservice.domain.repository.ProjectProductRepository;
import com.website.catalogservice.web.response.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/catalog")
@Tag(name = "Public catalog")
public class PublicCatalogController {

    private final ProjectProductRepository projectProductRepository;

    public PublicCatalogController(ProjectProductRepository projectProductRepository) {
        this.projectProductRepository = projectProductRepository;
    }

    @GetMapping("/products")
    public ApiResponse<List<Map<String, Object>>> products() {
        List<Map<String, Object>> items = projectProductRepository
                .findByDeletedAtIsNullAndActiveStatusOrderByOrderNoAscIdAsc("Y")
                .stream()
                .map(PublicCatalogController::toDto)
                .toList();
        return ApiResponse.ok(items);
    }

    private static Map<String, Object> toDto(ProjectProduct product) {
        return Map.of(
                "id", product.getId(),
                "name", product.getName() != null ? product.getName() : "",
                "title", product.getTitle() != null ? product.getTitle() : "",
                "description", product.getDescription() != null ? product.getDescription() : "",
                "type", product.getType() != null ? product.getType() : "",
                "logo", product.getLogo() != null ? product.getLogo() : "",
                "category", product.getCategory() != null ? product.getCategory() : ""
        );
    }
}
