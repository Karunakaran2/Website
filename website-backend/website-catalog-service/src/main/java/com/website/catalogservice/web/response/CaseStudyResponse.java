package com.website.catalogservice.web.response;

import com.website.catalogservice.domain.entity.Casestudy;

import java.time.Instant;

public record CaseStudyResponse(
        Long id,
        String category,
        String title,
        Instant postedOn,
        String postedBy,
        String imagePath,
        String attachmentPath,
        String link,
        String blogBanner,
        String activeStatus
) {

    public static CaseStudyResponse from(Casestudy casestudy) {
        return new CaseStudyResponse(
                casestudy.getId(),
                casestudy.getCategory(),
                casestudy.getTitle(),
                casestudy.getPostedOn(),
                casestudy.getPostedBy(),
                casestudy.getImagePath(),
                casestudy.getAttachmentPath(),
                casestudy.getLink(),
                casestudy.getBlogBanner(),
                casestudy.getActiveStatus()
        );
    }
}