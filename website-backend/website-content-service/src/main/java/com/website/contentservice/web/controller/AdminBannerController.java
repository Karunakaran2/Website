package com.website.contentservice.web.controller;

import com.website.contentservice.application.service.BannerService;
import com.website.contentservice.web.request.BannerUpsertRequest;
import com.website.contentservice.web.response.ApiResponse;
import com.website.contentservice.web.response.BannerResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/banners")
@Tag(name = "Admin content", description = "CMS banner management")
public class AdminBannerController {

    private final BannerService bannerService;

    public AdminBannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    @GetMapping
    public ApiResponse<List<BannerResponse>> list() {
        return ApiResponse.ok(bannerService.listAdmin());
    }

    @PostMapping
    public ApiResponse<BannerResponse> create(@Valid @RequestBody BannerUpsertRequest request) {
        return ApiResponse.ok(bannerService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<BannerResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody BannerUpsertRequest request
    ) {
        return ApiResponse.ok(bannerService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        bannerService.softDelete(id);
    }
}