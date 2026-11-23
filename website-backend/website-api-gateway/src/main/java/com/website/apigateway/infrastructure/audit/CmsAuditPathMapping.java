package com.website.apigateway.infrastructure.audit;

import org.springframework.http.HttpMethod;
import org.springframework.util.StringUtils;

import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class CmsAuditPathMapping {

    private static final Pattern TRAILING_ID =
            Pattern.compile("/(api/v1/(?:admin/)?[^/]+(?:/[^/]+)*)/([^/]+)$");

    private CmsAuditPathMapping() {
    }

    public static boolean isExcluded(String path) {
        if (!StringUtils.hasText(path)) {
            return true;
        }
        return path.startsWith("/api/v1/admin/audit-events")
                || path.startsWith("/api/v1/admin/users")
                || path.startsWith("/api/v1/admin/roles")
                || path.startsWith("/api/v1/admin/privileges")
                || path.startsWith("/api/v1/auth/");
    }

    public static boolean isAuditablePath(String path, HttpMethod method) {
        if (method == null || path == null) {
            return false;
        }
        if (isExcluded(path)) {
            return false;
        }
        return path.startsWith("/api/v1/admin/") || path.equals("/api/v1/media/upload");
    }

    public static String actionFor(HttpMethod method) {
        return switch (method.name()) {
            case "POST" -> "CREATE";
            case "PUT", "PATCH" -> "UPDATE";
            case "DELETE" -> "DELETE";
            default -> method.name();
        };
    }

    public static String moduleKeyFor(String path) {
        String normalized = path.toLowerCase(Locale.ROOT);
        if (normalized.contains("/admin/news")) {
            return "content_news";
        }
        if (normalized.contains("/admin/banners")) {
            return "content_banner";
        }
        if (normalized.contains("/admin/data-sheets")) {
            return "content_datasheet";
        }
        if (normalized.contains("/admin/timeline")) {
            return "content_timeline";
        }
        if (normalized.contains("/admin/products")) {
            return "catalog_products";
        }
        if (normalized.contains("/admin/solutions")) {
            return "catalog_solutions";
        }
        if (normalized.contains("/admin/projects")) {
            return "catalog_projects";
        }
        if (normalized.contains("/admin/case-studies")) {
            return "catalog_case_study";
        }
        if (normalized.contains("/admin/kran-seniors")) {
            return "catalog_kran_seniors";
        }
        if (normalized.contains("/admin/kran-faces")) {
            return "catalog_kran_faces";
        }
        if (normalized.contains("/admin/categories")) {
            return "catalog_categories";
        }
        if (normalized.contains("/admin/gallery-groups")) {
            return "media_gallery";
        }
        if (normalized.contains("/admin/gallery-items")) {
            return "media_gallery";
        }
        if (normalized.contains("/media/upload")) {
            return "media_upload";
        }
        if (normalized.contains("/admin/careers")) {
            return "careers";
        }
        if (normalized.contains("/admin/job-applications")
                || normalized.contains("/admin/submitted-resumes")) {
            return "careers";
        }
        if (normalized.contains("/admin/contacts")) {
            return "engagement";
        }
        if (normalized.contains("/admin/mail-setup")) {
            return "notification";
        }
        return "cms_other";
    }

    public static String entityTypeFor(String moduleKey) {
        return moduleKey.replace('.', '_');
    }

    public static String entityIdFromPath(String path) {
        Matcher matcher = TRAILING_ID.matcher(path);
        if (!matcher.find()) {
            return null;
        }
        String candidate = matcher.group(2);
        if (candidate == null || "upload".equalsIgnoreCase(candidate)) {
            return null;
        }
        return candidate;
    }

    public static String summaryFor(HttpMethod method, String path) {
        return method.name() + " " + path;
    }
}