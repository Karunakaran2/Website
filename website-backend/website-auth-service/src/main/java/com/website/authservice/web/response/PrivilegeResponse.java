package com.website.authservice.web.response;

public record PrivilegeResponse(
        String code,
        String name,
        String moduleKey,
        String action
) {
}