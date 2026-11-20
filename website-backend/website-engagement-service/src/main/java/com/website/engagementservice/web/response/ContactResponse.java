package com.website.engagementservice.web.response;

import com.website.engagementservice.domain.entity.Contact;

import java.time.Instant;

public record ContactResponse(
        Long id,
        String name,
        String email,
        String mobile,
        String organization,
        String remarks,
        String requestType,
        String productName,
        Instant submittedOn
) {

    public static ContactResponse from(Contact contact) {
        return new ContactResponse(
                contact.getId(),
                contact.getName(),
                contact.getEmail(),
                contact.getMobile(),
                contact.getOrganization(),
                contact.getRemarks(),
                contact.getRequestType(),
                contact.getProductName(),
                contact.getSubmittedOn()
        );
    }
}