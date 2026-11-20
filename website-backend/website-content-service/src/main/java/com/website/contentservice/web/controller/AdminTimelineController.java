package com.website.contentservice.web.controller;

import com.website.contentservice.application.service.TimelineService;
import com.website.contentservice.web.request.TimelineUpsertRequest;
import com.website.contentservice.web.response.ApiResponse;
import com.website.contentservice.web.response.TimelineResponse;
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
@RequestMapping("/api/v1/admin/timeline")
@Tag(name = "Admin content", description = "CMS timeline management")
public class AdminTimelineController {

    private final TimelineService timelineService;

    public AdminTimelineController(TimelineService timelineService) {
        this.timelineService = timelineService;
    }

    @GetMapping
    public ApiResponse<List<TimelineResponse>> list() {
        return ApiResponse.ok(timelineService.listAdmin());
    }

    @PostMapping
    public ApiResponse<TimelineResponse> create(@Valid @RequestBody TimelineUpsertRequest request) {
        return ApiResponse.ok(timelineService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<TimelineResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody TimelineUpsertRequest request
    ) {
        return ApiResponse.ok(timelineService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        timelineService.softDelete(id);
    }
}