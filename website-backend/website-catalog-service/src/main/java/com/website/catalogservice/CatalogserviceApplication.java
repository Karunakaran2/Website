package com.website.catalogservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication(scanBasePackages = "com.website.catalogservice")
public class CatalogserviceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CatalogserviceApplication.class, args);
    }
}
