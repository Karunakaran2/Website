package com.website.contentservice.web.response;

import com.website.contentservice.domain.entity.Blog;

import java.time.Instant;

public record DataSheetResponse(
        Long id,
        String category,
        String title,
        Instant postedOn,
        String postedBy,
        String imagePath,
        String attachmentPath,
        String link,
        String activeStatus
) {

    public static DataSheetResponse from(Blog blog) {
        return new DataSheetResponse(
                blog.getId(),
                blog.getCategory(),
                blog.getTitle(),
                blog.getPostedOn(),
                blog.getPostedBy(),
                blog.getImagePath(),
                blog.getAttachmentPath(),
                blog.getLink(),
                blog.getActiveStatus()
        );
    }
}