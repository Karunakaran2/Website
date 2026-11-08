package com.website.contentservice.web.response;

import com.website.contentservice.domain.entity.News;

import java.time.Instant;

public record NewsResponse(
        Long id,
        String title,
        String newsDescription,
        Instant publishDate,
        String imagePath,
        String newsLink,
        String activeStatus
) {

    public static NewsResponse from(News news) {
        return new NewsResponse(
                news.getId(),
                news.getTitle(),
                news.getNewsDescription(),
                news.getPublishDate(),
                news.getImagePath(),
                news.getNewsLink(),
                news.getActiveStatus()
        );
    }
}
