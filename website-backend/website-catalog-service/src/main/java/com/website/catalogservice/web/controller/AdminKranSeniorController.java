package com.website.catalogservice.web.controller;

import com.website.catalogservice.application.service.KranSeniorService;
import com.website.catalogservice.web.request.KranSeniorUpsertRequest;
import com.website.catalogservice.web.response.ApiResponse;
import com.website.catalogservice.web.response.KranSeniorResponse;
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
@RequestMapping("/api/v1/admin/kran-seniors")
@Tag(name = "Admin catalog", description = "Kran senior management")
public class AdminKranSeniorController {

    private final KranSeniorService kranSeniorService;

    public AdminKranSeniorController(KranSeniorService kranSeniorService) {
        this.kranSeniorService = kranSeniorService;
    }

    @GetMapping
    public ApiResponse<List<KranSeniorResponse>> list() {
        return ApiResponse.ok(kranSeniorService.listAdmin());
    }

    @PostMapping
    public ApiResponse<KranSeniorResponse> create(@Valid @RequestBody KranSeniorUpsertRequest request) {
        return ApiResponse.ok(kranSeniorService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<KranSeniorResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody KranSeniorUpsertRequest request
    ) {
        return ApiResponse.ok(kranSeniorService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        kranSeniorService.softDelete(id);
    }
}