package com.website.catalogservice.web.request;

import jakarta.validation.constraints.NotBlank;

public record CategoryUpsertRequest(
        @NotBlank String name,
        String type,
        String activeStatus
) {
}