package com.website.catalogservice.web.response;

import com.website.catalogservice.domain.entity.ProjectProduct;

public record ProductResponse(
        Long id,
        String name,
        String title,
        String description,
        String type,
        String logo,
        String category,
        Integer orderNo,
        String activeStatus
) {

    public static ProductResponse from(ProjectProduct product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getTitle(),
                product.getDescription(),
                product.getType(),
                product.getLogo(),
                product.getCategory(),
                product.getOrderNo(),
                product.getActiveStatus()
        );
    }
}