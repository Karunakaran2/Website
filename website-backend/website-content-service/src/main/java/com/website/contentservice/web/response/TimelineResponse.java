package com.website.contentservice.web.response;

import com.website.contentservice.domain.entity.KranTimeline;

import java.time.Instant;

public record TimelineResponse(
        Long id,
        String title,
        String heading,
        String description,
        Instant submittedOn,
        String activeStatus
) {

    public static TimelineResponse from(KranTimeline timeline) {
        return new TimelineResponse(
                timeline.getId(),
                timeline.getTitle(),
                timeline.getHeading(),
                timeline.getDescription(),
                timeline.getSubmittedOn(),
                timeline.getActiveStatus()
        );
    }
}