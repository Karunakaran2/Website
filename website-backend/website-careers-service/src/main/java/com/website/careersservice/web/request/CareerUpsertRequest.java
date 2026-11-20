package com.website.careersservice.web.request;

import java.time.Instant;

public record CareerUpsertRequest(
        String title,
        String jobDescription,
        Instant postedOn,
        Instant lastDate,
        String skillSet,
        String location,
        String experience,
        String activeStatus
) {
}