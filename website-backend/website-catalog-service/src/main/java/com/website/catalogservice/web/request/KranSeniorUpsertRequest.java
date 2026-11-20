package com.website.catalogservice.web.request;

import java.time.Instant;
import java.time.LocalDate;

public record KranSeniorUpsertRequest(
        String name,
        String designation,
        String position,
        String quotes,
        String experience,
        LocalDate joiningDate,
        String imagePath,
        Instant submittedOn,
        String activeStatus
) {
}