package com.website.engagementservice.web.controller;

import com.website.engagementservice.domain.entity.Contact;
import com.website.engagementservice.domain.repository.ContactRepository;
import com.website.engagementservice.web.response.ApiResponse;
import com.website.engagementservice.web.response.ContactResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.function.Predicate;

@RestController
@RequestMapping("/api/v1/admin/contacts")
@Tag(name = "Admin engagement", description = "CMS contact inbox")
public class AdminContactController {

    private static final Set<String> GENERAL_REQUEST_TYPES = Set.of("G", "E", "C");
    private static final Set<String> SOLUTION_REQUEST_TYPES = Set.of("B", "D", "T");

    private final ContactRepository contactRepository;

    public AdminContactController(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @GetMapping
    public ApiResponse<List<ContactResponse>> list(
            @RequestParam(required = false) String scope
    ) {
        Predicate<Contact> scopeFilter = scopeFilter(scope);
        List<ContactResponse> items = contactRepository.findAll().stream()
                .filter(scopeFilter)
                .sorted(Comparator.comparing(Contact::getSubmittedOn).reversed())
                .map(ContactResponse::from)
                .toList();
        return ApiResponse.ok(items);
    }

    private static Predicate<Contact> scopeFilter(String scope) {
        if (!StringUtils.hasText(scope)) {
            return contact -> true;
        }
        return switch (scope.trim().toLowerCase()) {
            case "request" -> contact -> GENERAL_REQUEST_TYPES.contains(contact.getRequestType());
            case "solution" -> contact -> SOLUTION_REQUEST_TYPES.contains(contact.getRequestType())
                    || StringUtils.hasText(contact.getProductName());
            default -> contact -> true;
        };
    }
}