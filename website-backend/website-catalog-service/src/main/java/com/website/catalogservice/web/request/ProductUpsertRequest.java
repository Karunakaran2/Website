package com.website.catalogservice.web.request;

public record ProductUpsertRequest(
        String name,
        String title,
        String description,
        String type,
        String logo,
        String category,
        Integer orderNo,
        String activeStatus
) {
}