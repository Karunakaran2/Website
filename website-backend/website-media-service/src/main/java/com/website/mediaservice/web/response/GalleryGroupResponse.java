package com.website.mediaservice.web.response;

import com.website.mediaservice.domain.entity.GallGroup;

import java.time.Instant;

public record GalleryGroupResponse(
        Long groupId,
        String title,
        Instant postedOn,
        String imagePath,
        String activeStatus
) {

    public static GalleryGroupResponse from(GallGroup group) {
        return new GalleryGroupResponse(
                group.getGroupId(),
                group.getTitle(),
                group.getPostedOn(),
                group.getImagePath(),
                group.getActiveStatus()
        );
    }
}