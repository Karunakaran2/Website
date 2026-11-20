package com.website.careersservice.web.response;

import com.website.careersservice.domain.entity.Career;

import java.time.Instant;

public record CareerResponse(
        Long id,
        String title,
        String jobDescription,
        Instant postedOn,
        Instant lastDate,
        String skillSet,
        String location,
        String experience,
        String activeStatus
) {

    public static CareerResponse from(Career career) {
        return new CareerResponse(
                career.getId(),
                career.getTitle(),
                career.getJobDescription(),
                career.getPostedOn(),
                career.getLastDate(),
                career.getSkillSet(),
                career.getLocation(),
                career.getExperience(),
                career.getActiveStatus()
        );
    }
}