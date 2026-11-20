package com.website.contentservice.web.request;

import java.time.Instant;

public record TimelineUpsertRequest(
        String title,
        String heading,
        String description,
        Instant submittedOn,
        String activeStatus
) {
}