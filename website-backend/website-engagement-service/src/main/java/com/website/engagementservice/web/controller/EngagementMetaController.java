package com.website.engagementservice.web.controller;

import com.website.engagementservice.web.response.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/engagement")
@Tag(name = "Public engagement", description = "Engagement service metadata")
public class EngagementMetaController {

    @GetMapping
    public ApiResponse<Map<String, String>> info() {
        return ApiResponse.ok(Map.of(
                "service", "engagement-service",
                "contactPath", "/api/v1/contact"
        ));
    }
}