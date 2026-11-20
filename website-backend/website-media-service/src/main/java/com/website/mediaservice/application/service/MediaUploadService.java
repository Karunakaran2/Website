package com.website.mediaservice.application.service;

import com.website.mediaservice.config.MediaStorageProperties;
import com.website.mediaservice.web.response.MediaUploadResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class MediaUploadService {

    private static final Set<String> IMAGE_EXTENSIONS = Set.of("png", "jpg", "jpeg", "gif", "webp", "svg", "bmp");
    private static final Set<String> DOCUMENT_EXTENSIONS = Set.of(
            "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv", "zip"
    );

    private final MediaStorageProperties storageProperties;

    public MediaUploadService(MediaStorageProperties storageProperties) {
        this.storageProperties = storageProperties;
    }

    public MediaUploadResponse store(MultipartFile file, String kind) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }
        String original = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload");
        if (original.contains("..")) {
            throw new IllegalArgumentException("Invalid file name");
        }
        String extension = extractExtension(original);
        validateKind(kind, extension, file.getContentType());

        Path baseDir = storageProperties.resolvedUploadDir();
        String folder = normalizeKind(kind);
        Path targetDir = baseDir.resolve(folder);
        Files.createDirectories(targetDir);

        String storedName = UUID.randomUUID() + (extension.isEmpty() ? "" : "." + extension);
        Path targetFile = targetDir.resolve(storedName);
        file.transferTo(targetFile.toFile());

        String publicPath = "/api/v1/media/files/" + folder + "/" + storedName;
        return new MediaUploadResponse(
                publicPath,
                original,
                file.getContentType(),
                file.getSize()
        );
    }

    public Path resolveStoredFile(String folder, String fileName) {
        if (!StringUtils.hasText(folder) || !StringUtils.hasText(fileName) || fileName.contains("..")) {
            throw new IllegalArgumentException("Invalid path");
        }
        Path file = storageProperties.resolvedUploadDir().resolve(folder).resolve(fileName).normalize();
        if (!file.startsWith(storageProperties.resolvedUploadDir())) {
            throw new IllegalArgumentException("Invalid path");
        }
        return file;
    }

    private static String normalizeKind(String kind) {
        if (!StringUtils.hasText(kind)) {
            return "images";
        }
        String normalized = kind.trim().toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "image", "images" -> "images";
            case "document", "documents", "attachment", "attachments" -> "documents";
            default -> "files";
        };
    }

    private static void validateKind(String kind, String extension, String contentType) {
        String folder = normalizeKind(kind);
        if ("images".equals(folder)) {
            boolean imageExt = IMAGE_EXTENSIONS.contains(extension.toLowerCase(Locale.ROOT));
            boolean imageMime = contentType != null && contentType.toLowerCase(Locale.ROOT).startsWith(MediaType.IMAGE_VALUE);
            if (!imageExt && !imageMime) {
                throw new IllegalArgumentException("Only image files are allowed for image upload");
            }
            return;
        }
        if ("documents".equals(folder)) {
            if (!DOCUMENT_EXTENSIONS.contains(extension.toLowerCase(Locale.ROOT))
                    && !(contentType != null && !contentType.toLowerCase(Locale.ROOT).startsWith(MediaType.IMAGE_VALUE))) {
                // allow common office docs by mime even if extension odd
                if (contentType == null || contentType.startsWith("image/")) {
                    throw new IllegalArgumentException("Upload a document file (PDF, Office, ZIP, etc.)");
                }
            }
        }
    }

    private static String extractExtension(String fileName) {
        int dot = fileName.lastIndexOf('.');
        if (dot < 0 || dot == fileName.length() - 1) {
            return "";
        }
        return fileName.substring(dot + 1).toLowerCase(Locale.ROOT);
    }
}