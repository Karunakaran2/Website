package com.website.notificationservice.web.request;

import jakarta.validation.constraints.NotBlank;

import java.time.Instant;

public record MailSetupUpsertRequest(
        @NotBlank String type,
        String mailTo,
        String mailCc,
        Instant addedOn,
        String activeStatus,
        Instant deactivatedOn
) {
}