package com.website.notificationservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class NotificationserviceHealthController {
    @GetMapping("/api/v1/health")
    public Map<String, String> health() {
        return Map.of("service", "notification-service", "status", "UP");
    }
}
