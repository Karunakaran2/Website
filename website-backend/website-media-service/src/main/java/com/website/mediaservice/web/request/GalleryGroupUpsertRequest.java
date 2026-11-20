package com.website.mediaservice.web.request;

import java.time.Instant;

public record GalleryGroupUpsertRequest(
        String title,
        Instant postedOn,
        String imagePath,
        String activeStatus
) {
}