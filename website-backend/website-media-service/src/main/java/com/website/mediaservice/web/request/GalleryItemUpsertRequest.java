package com.website.mediaservice.web.request;

import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record GalleryItemUpsertRequest(
        String title,
        Instant postedOn,
        String imagePath,
        @NotNull Long groupId,
        String type
) {
}