package com.website.mediaservice.web.controller;

import com.website.mediaservice.application.service.MediaUploadService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/v1/media/files")
public class MediaFileController {

    private final MediaUploadService mediaUploadService;

    public MediaFileController(MediaUploadService mediaUploadService) {
        this.mediaUploadService = mediaUploadService;
    }

    @GetMapping("/{folder}/{fileName}")
    public ResponseEntity<Resource> serve(@PathVariable String folder, @PathVariable String fileName) throws IOException {
        Path file = mediaUploadService.resolveStoredFile(folder, fileName);
        if (!Files.exists(file) || !Files.isRegularFile(file)) {
            return ResponseEntity.notFound().build();
        }
        String contentType = Files.probeContentType(file);
        MediaType mediaType = contentType != null ? MediaType.parseMediaType(contentType) : MediaType.APPLICATION_OCTET_STREAM;
        FileSystemResource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .body(resource);
    }
}