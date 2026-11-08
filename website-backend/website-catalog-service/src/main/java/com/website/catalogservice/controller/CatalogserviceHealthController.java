package com.website.catalogservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class CatalogserviceHealthController {
    @GetMapping("/api/v1/health")
    public Map<String, String> health() {
        return Map.of("service", "catalog-service", "status", "UP");
    }
}
