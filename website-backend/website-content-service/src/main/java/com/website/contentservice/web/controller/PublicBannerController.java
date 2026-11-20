package com.website.contentservice.web.controller;

import com.website.contentservice.application.service.BannerService;
import com.website.contentservice.web.response.ApiResponse;
import com.website.contentservice.web.response.BannerResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/content/banners")
@Tag(name = "Public content", description = "Published website banners")
public class PublicBannerController {

    private final BannerService bannerService;

    public PublicBannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    @GetMapping
    public ApiResponse<List<BannerResponse>> list() {
        return ApiResponse.ok(bannerService.listPublic());
    }
}