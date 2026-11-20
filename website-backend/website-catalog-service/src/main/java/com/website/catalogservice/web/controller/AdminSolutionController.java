package com.website.catalogservice.web.controller;

import com.website.catalogservice.application.service.SolutionService;
import com.website.catalogservice.web.request.SolutionUpsertRequest;
import com.website.catalogservice.web.response.ApiResponse;
import com.website.catalogservice.web.response.SolutionResponse;
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
@RequestMapping("/api/v1/admin/solutions")
@Tag(name = "Admin catalog", description = "Solution management")
public class AdminSolutionController {

    private final SolutionService solutionService;

    public AdminSolutionController(SolutionService solutionService) {
        this.solutionService = solutionService;
    }

    @GetMapping
    public ApiResponse<List<SolutionResponse>> list() {
        return ApiResponse.ok(solutionService.listAdmin());
    }

    @PostMapping
    public ApiResponse<SolutionResponse> create(@Valid @RequestBody SolutionUpsertRequest request) {
        return ApiResponse.ok(solutionService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<SolutionResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody SolutionUpsertRequest request
    ) {
        return ApiResponse.ok(solutionService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        solutionService.softDelete(id);
    }
}