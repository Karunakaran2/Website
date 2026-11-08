package com.website.contentservice.web.controller;

import com.website.contentservice.application.service.NewsService;
import com.website.contentservice.web.request.NewsUpsertRequest;
import com.website.contentservice.web.response.ApiResponse;
import com.website.contentservice.web.response.NewsResponse;
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
@RequestMapping("/api/v1/admin/news")
@Tag(name = "Admin content", description = "CMS news management")
public class AdminNewsController {

    private final NewsService newsService;

    public AdminNewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping
    public ApiResponse<List<NewsResponse>> list() {
        return ApiResponse.ok(newsService.listAdmin());
    }

    @PostMapping
    public ApiResponse<NewsResponse> create(@Valid @RequestBody NewsUpsertRequest request) {
        return ApiResponse.ok(newsService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<NewsResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody NewsUpsertRequest request
    ) {
        return ApiResponse.ok(newsService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        newsService.softDelete(id);
    }
}
