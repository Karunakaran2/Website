package com.website.authservice.web.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

public record AdminUserUpsertRequest(
        @NotBlank @Size(max = 128) String username,
        @Size(max = 255) String displayName,
        @Size(max = 128) String password,
        Boolean active,
        Boolean systemAdmin,
        Boolean useCustomPrivileges,
        UUID roleId,
        List<String> privilegeCodes
) {
}