package com.website.contentservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class ContentserviceHealthController {
    @GetMapping("/api/v1/health")
    public Map<String, String> health() {
        return Map.of("service", "content-service", "status", "UP");
    }
}
