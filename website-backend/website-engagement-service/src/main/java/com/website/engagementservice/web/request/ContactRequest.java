package com.website.engagementservice.web.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotBlank @Size(max = 500) String name,
        @NotBlank @Email @Size(max = 300) String email,
        @NotBlank @Size(max = 20) String mobile,
        @Size(max = 500) String organization,
        String remarks,
        @NotBlank @Pattern(regexp = "[GBDTEC]") String requestType,
        @Size(max = 255) String productName
) {
}
