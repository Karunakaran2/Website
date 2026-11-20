package com.website.catalogservice.web.request;

import java.time.Instant;

public record CaseStudyUpsertRequest(
        String category,
        String title,
        Instant postedOn,
        String postedBy,
        String imagePath,
        String attachmentPath,
        String link,
        String blogBanner,
        String activeStatus
) {
}