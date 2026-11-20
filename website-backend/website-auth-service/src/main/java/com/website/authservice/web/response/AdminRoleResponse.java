package com.website.authservice.web.response;

import java.util.List;
import java.util.UUID;

public record AdminRoleResponse(
        UUID id,
        String code,
        String name,
        String description,
        boolean builtIn,
        List<String> privilegeCodes
) {
}