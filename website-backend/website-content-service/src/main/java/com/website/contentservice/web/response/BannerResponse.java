package com.website.contentservice.web.response;

import com.website.contentservice.domain.entity.Banner;

public record BannerResponse(
        Long id,
        String heading,
        String title,
        String imagePath,
        String link,
        Integer orderNo,
        String activeStatus
) {

    public static BannerResponse from(Banner banner) {
        return new BannerResponse(
                banner.getId(),
                banner.getHeading(),
                banner.getTitle(),
                banner.getImagePath(),
                banner.getLink(),
                banner.getOrderNo(),
                banner.getActiveStatus()
        );
    }
}