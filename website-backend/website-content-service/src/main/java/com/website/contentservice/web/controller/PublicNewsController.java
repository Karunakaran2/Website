package com.website.contentservice.web.controller;

import com.website.contentservice.application.service.NewsService;
import com.website.contentservice.web.response.ApiResponse;
import com.website.contentservice.web.response.NewsResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/content/news")
@Tag(name = "Public content", description = "Published website content")
public class PublicNewsController {

    private final NewsService newsService;

    public PublicNewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping
    public ApiResponse<List<NewsResponse>> list() {
        return ApiResponse.ok(newsService.listPublic());
    }
}
