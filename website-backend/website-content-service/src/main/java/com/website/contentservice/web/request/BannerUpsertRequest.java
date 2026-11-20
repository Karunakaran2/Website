package com.website.contentservice.web.request;

import jakarta.validation.constraints.NotBlank;

public record BannerUpsertRequest(
        String heading,
        @NotBlank String title,
        String imagePath,
        String link,
        Integer orderNo,
        String activeStatus
) {
}