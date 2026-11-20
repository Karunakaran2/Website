package com.website.notificationservice.web.response;

import com.website.notificationservice.domain.entity.MailSetup;

import java.time.Instant;

public record MailSetupResponse(
        Long id,
        String type,
        String mailTo,
        String mailCc,
        Instant addedOn,
        String activeStatus,
        Instant deactivatedOn
) {

    public static MailSetupResponse from(MailSetup mailSetup) {
        return new MailSetupResponse(
                mailSetup.getId(),
                mailSetup.getType(),
                mailSetup.getMailTo(),
                mailSetup.getMailCc(),
                mailSetup.getAddedOn(),
                mailSetup.getActiveStatus(),
                mailSetup.getDeactivatedOn()
        );
    }
}