package com.website.mediaservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.nio.file.Paths;

@Component
@ConfigurationProperties(prefix = "website.media")
public class MediaStorageProperties {

    private String uploadDir = "data/uploads";

    public Path resolvedUploadDir() {
        return Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    public String getUploadDir() {
        return uploadDir;
    }

    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }
}