package com.website.engagementservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication(scanBasePackages = "com.website.engagementservice")
public class EngagementserviceApplication {
    public static void main(String[] args) {
        SpringApplication.run(EngagementserviceApplication.class, args);
    }
}
