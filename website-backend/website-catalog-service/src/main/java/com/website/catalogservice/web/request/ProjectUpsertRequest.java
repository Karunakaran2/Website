package com.website.catalogservice.web.request;

import java.time.Instant;

public record ProjectUpsertRequest(
        String category,
        String title,
        String cStatus,
        String serviceCon,
        String serviceSddwm,
        String serviceSdd,
        String servicePi,
        String serviceOms,
        String serviceDm,
        String serviceAm,
        String serviceDbm,
        String serviceTsu,
        String serviceCcn,
        String servicePas,
        String sdescription,
        String description,
        String cDescription,
        String department,
        String client,
        String imagePath,
        Instant submittedOn,
        String activeStatus
) {
}