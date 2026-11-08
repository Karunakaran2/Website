package com.website.engagementservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class EngagementserviceHealthController {
    @GetMapping("/api/v1/health")
    public Map<String, String> health() {
        return Map.of("service", "engagement-service", "status", "UP");
    }
}
