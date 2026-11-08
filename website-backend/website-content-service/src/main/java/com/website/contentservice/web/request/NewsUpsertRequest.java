package com.website.contentservice.web.request;

import jakarta.validation.constraints.NotBlank;

import java.time.Instant;

public record NewsUpsertRequest(
        @NotBlank String title,
        String newsDescription,
        Instant publishDate,
        String imagePath,
        String newsLink,
        String activeStatus
) {
}
