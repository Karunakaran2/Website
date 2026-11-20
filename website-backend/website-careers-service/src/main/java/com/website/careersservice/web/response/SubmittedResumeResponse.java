package com.website.careersservice.web.response;

import com.website.careersservice.domain.entity.SubmittedResume;

import java.time.Instant;

public record SubmittedResumeResponse(
        Long id,
        String name,
        String email,
        String mobile,
        String exp,
        String intro,
        String resumePath,
        Instant submittedOn,
        String role
) {

    public static SubmittedResumeResponse from(SubmittedResume resume) {
        return new SubmittedResumeResponse(
                resume.getId(),
                resume.getName(),
                resume.getEmail(),
                resume.getMobile(),
                resume.getExp(),
                resume.getIntro(),
                resume.getResumePath(),
                resume.getSubmittedOn(),
                resume.getRole()
        );
    }
}