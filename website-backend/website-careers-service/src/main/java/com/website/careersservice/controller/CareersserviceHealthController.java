package com.website.careersservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class CareersserviceHealthController {
    @GetMapping("/api/v1/health")
    public Map<String, String> health() {
        return Map.of("service", "careers-service", "status", "UP");
    }
}
