package com.website.engagementservice.web.controller;

import com.website.engagementservice.domain.entity.Contact;
import com.website.engagementservice.domain.repository.ContactRepository;
import com.website.engagementservice.web.request.ContactRequest;
import com.website.engagementservice.web.response.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/contact")
@Tag(name = "Public engagement")
public class ContactController {

    private final ContactRepository contactRepository;

    public ContactController(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Map<String, Long>> submit(@Valid @RequestBody ContactRequest request) {
        Contact contact = new Contact();
        contact.setName(request.name().trim());
        contact.setEmail(request.email().trim());
        contact.setMobile(request.mobile().trim());
        contact.setOrganization(request.organization());
        contact.setRemarks(request.remarks());
        contact.setRequestType(request.requestType());
        contact.setProductName(request.productName());
        Contact saved = contactRepository.save(contact);
        return ApiResponse.ok(Map.of("id", saved.getId()));
    }
}
