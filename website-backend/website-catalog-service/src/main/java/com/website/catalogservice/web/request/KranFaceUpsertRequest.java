package com.website.catalogservice.web.request;

import java.time.Instant;

public record KranFaceUpsertRequest(
        String title,
        String name,
        String status,
        String imagePath,
        Instant submittedOn,
        String activeStatus
) {
}