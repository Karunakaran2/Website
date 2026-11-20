package com.website.catalogservice.web.response;

import com.website.catalogservice.domain.entity.KranFace;

import java.time.Instant;

public record KranFaceResponse(
        Long id,
        String title,
        String name,
        String status,
        String imagePath,
        Instant submittedOn,
        String activeStatus
) {

    public static KranFaceResponse from(KranFace face) {
        return new KranFaceResponse(
                face.getId(),
                face.getTitle(),
                face.getName(),
                face.getStatus(),
                face.getImagePath(),
                face.getSubmittedOn(),
                face.getActiveStatus()
        );
    }
}