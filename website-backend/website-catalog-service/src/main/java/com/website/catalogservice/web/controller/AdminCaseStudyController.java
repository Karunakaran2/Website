package com.website.catalogservice.web.controller;

import com.website.catalogservice.application.service.CaseStudyService;
import com.website.catalogservice.web.request.CaseStudyUpsertRequest;
import com.website.catalogservice.web.response.ApiResponse;
import com.website.catalogservice.web.response.CaseStudyResponse;
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
@RequestMapping("/api/v1/admin/case-studies")
@Tag(name = "Admin catalog", description = "Case study management")
public class AdminCaseStudyController {

    private final CaseStudyService caseStudyService;

    public AdminCaseStudyController(CaseStudyService caseStudyService) {
        this.caseStudyService = caseStudyService;
    }

    @GetMapping
    public ApiResponse<List<CaseStudyResponse>> list() {
        return ApiResponse.ok(caseStudyService.listAdmin());
    }

    @PostMapping
    public ApiResponse<CaseStudyResponse> create(@Valid @RequestBody CaseStudyUpsertRequest request) {
        return ApiResponse.ok(caseStudyService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<CaseStudyResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody CaseStudyUpsertRequest request
    ) {
        return ApiResponse.ok(caseStudyService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        caseStudyService.softDelete(id);
    }
}