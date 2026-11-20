package com.website.contentservice.web.request;

import jakarta.validation.constraints.NotBlank;

import java.time.Instant;

public record DataSheetUpsertRequest(
        String category,
        @NotBlank String title,
        Instant postedOn,
        String postedBy,
        String imagePath,
        String attachmentPath,
        String link,
        String activeStatus
) {
}