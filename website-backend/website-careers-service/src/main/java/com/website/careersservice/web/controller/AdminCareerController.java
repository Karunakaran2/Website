package com.website.careersservice.web.controller;

import com.website.careersservice.application.service.CareerService;
import com.website.careersservice.web.request.CareerUpsertRequest;
import com.website.careersservice.web.response.ApiResponse;
import com.website.careersservice.web.response.CareerResponse;
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
@RequestMapping("/api/v1/admin/careers")
@Tag(name = "Admin careers", description = "CMS career posting management")
public class AdminCareerController {

    private final CareerService careerService;

    public AdminCareerController(CareerService careerService) {
        this.careerService = careerService;
    }

    @GetMapping
    public ApiResponse<List<CareerResponse>> list() {
        return ApiResponse.ok(careerService.listAdmin());
    }

    @PostMapping
    public ApiResponse<CareerResponse> create(@Valid @RequestBody CareerUpsertRequest request) {
        return ApiResponse.ok(careerService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<CareerResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody CareerUpsertRequest request
    ) {
        return ApiResponse.ok(careerService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        careerService.softDelete(id);
    }
}