package com.website.contentservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication(scanBasePackages = "com.website.contentservice")
public class ContentserviceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ContentserviceApplication.class, args);
    }
}
