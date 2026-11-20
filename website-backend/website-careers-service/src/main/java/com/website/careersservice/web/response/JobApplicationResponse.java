package com.website.careersservice.web.response;

import com.website.careersservice.domain.entity.ApplicationRequest;
import com.website.careersservice.domain.entity.Career;

import java.time.Instant;

public record JobApplicationResponse(
        Long id,
        Long careerId,
        String careerTitle,
        String name,
        String email,
        String mobile,
        String resumePath,
        Instant submittedOn
) {

    public static JobApplicationResponse from(ApplicationRequest application) {
        Career career = application.getCareer();
        Long careerId = career != null ? career.getId() : null;
        String careerTitle = career != null ? career.getTitle() : null;
        return new JobApplicationResponse(
                application.getId(),
                careerId,
                careerTitle,
                application.getName(),
                application.getEmail(),
                application.getMobile(),
                application.getResumePath(),
                application.getSubmittedOn()
        );
    }
}