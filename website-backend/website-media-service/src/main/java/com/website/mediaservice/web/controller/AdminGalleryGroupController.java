package com.website.mediaservice.web.controller;

import com.website.mediaservice.application.service.GalleryGroupService;
import com.website.mediaservice.web.request.GalleryGroupUpsertRequest;
import com.website.mediaservice.web.response.ApiResponse;
import com.website.mediaservice.web.response.GalleryGroupResponse;
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
@RequestMapping("/api/v1/admin/gallery-groups")
@Tag(name = "Admin media", description = "CMS gallery group management")
public class AdminGalleryGroupController {

    private final GalleryGroupService galleryGroupService;

    public AdminGalleryGroupController(GalleryGroupService galleryGroupService) {
        this.galleryGroupService = galleryGroupService;
    }

    @GetMapping
    public ApiResponse<List<GalleryGroupResponse>> list() {
        return ApiResponse.ok(galleryGroupService.listAdmin());
    }

    @PostMapping
    public ApiResponse<GalleryGroupResponse> create(@Valid @RequestBody GalleryGroupUpsertRequest request) {
        return ApiResponse.ok(galleryGroupService.create(request));
    }

    @PutMapping("/{groupId}")
    public ApiResponse<GalleryGroupResponse> update(
            @PathVariable Long groupId,
            @Valid @RequestBody GalleryGroupUpsertRequest request
    ) {
        return ApiResponse.ok(galleryGroupService.update(groupId, request));
    }

    @DeleteMapping("/{groupId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long groupId) {
        galleryGroupService.softDelete(groupId);
    }
}