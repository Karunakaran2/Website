package com.website.mediaservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication(scanBasePackages = "com.website.mediaservice")
public class MediaserviceApplication {
    public static void main(String[] args) {
        SpringApplication.run(MediaserviceApplication.class, args);
    }
}
