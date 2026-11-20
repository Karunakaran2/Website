package com.website.catalogservice.web.response;

import com.website.catalogservice.domain.entity.KranSenior;

import java.time.Instant;
import java.time.LocalDate;

public record KranSeniorResponse(
        Long id,
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

    public static KranSeniorResponse from(KranSenior senior) {
        return new KranSeniorResponse(
                senior.getId(),
                senior.getName(),
                senior.getDesignation(),
                senior.getPosition(),
                senior.getQuotes(),
                senior.getExperience(),
                senior.getJoiningDate(),
                senior.getImagePath(),
                senior.getSubmittedOn(),
                senior.getActiveStatus()
        );
    }
}