package com.website.careersservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication(scanBasePackages = "com.website.careersservice")
public class CareersserviceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CareersserviceApplication.class, args);
    }
}
