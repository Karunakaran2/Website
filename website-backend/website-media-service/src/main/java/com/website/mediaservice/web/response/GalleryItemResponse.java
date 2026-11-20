package com.website.mediaservice.web.response;

import com.website.mediaservice.domain.entity.Gallery;

import java.time.Instant;

public record GalleryItemResponse(
        Long id,
        String title,
        Instant postedOn,
        String imagePath,
        Long groupId,
        String type
) {

    public static GalleryItemResponse from(Gallery gallery) {
        return new GalleryItemResponse(
                gallery.getId(),
                gallery.getTitle(),
                gallery.getPostedOn(),
                gallery.getImagePath(),
                gallery.getGroupId(),
                gallery.getType()
        );
    }
}