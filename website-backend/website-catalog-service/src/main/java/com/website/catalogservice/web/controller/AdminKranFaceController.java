package com.website.catalogservice.web.controller;

import com.website.catalogservice.application.service.KranFaceService;
import com.website.catalogservice.web.request.KranFaceUpsertRequest;
import com.website.catalogservice.web.response.ApiResponse;
import com.website.catalogservice.web.response.KranFaceResponse;
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
@RequestMapping("/api/v1/admin/kran-faces")
@Tag(name = "Admin catalog", description = "Kran face management")
public class AdminKranFaceController {

    private final KranFaceService kranFaceService;

    public AdminKranFaceController(KranFaceService kranFaceService) {
        this.kranFaceService = kranFaceService;
    }

    @GetMapping
    public ApiResponse<List<KranFaceResponse>> list() {
        return ApiResponse.ok(kranFaceService.listAdmin());
    }

    @PostMapping
    public ApiResponse<KranFaceResponse> create(@Valid @RequestBody KranFaceUpsertRequest request) {
        return ApiResponse.ok(kranFaceService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<KranFaceResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody KranFaceUpsertRequest request
    ) {
        return ApiResponse.ok(kranFaceService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        kranFaceService.softDelete(id);
    }
}