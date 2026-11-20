package com.website.mediaservice.web.response;

public record MediaUploadResponse(
        String url,
        String originalFileName,
        String contentType,
        long sizeBytes
) {
}