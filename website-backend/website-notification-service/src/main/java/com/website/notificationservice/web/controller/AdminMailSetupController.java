package com.website.notificationservice.web.controller;

import com.website.notificationservice.application.service.MailSetupService;
import com.website.notificationservice.web.request.MailSetupUpsertRequest;
import com.website.notificationservice.web.response.ApiResponse;
import com.website.notificationservice.web.response.MailSetupResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/mail-setup")
@Tag(name = "Admin notification", description = "CMS mail routing configuration")
public class AdminMailSetupController {

    private final MailSetupService mailSetupService;

    public AdminMailSetupController(MailSetupService mailSetupService) {
        this.mailSetupService = mailSetupService;
    }

    @GetMapping
    public ApiResponse<List<MailSetupResponse>> list() {
        return ApiResponse.ok(mailSetupService.listAdmin());
    }

    @PostMapping
    public ApiResponse<MailSetupResponse> create(@Valid @RequestBody MailSetupUpsertRequest request) {
        return ApiResponse.ok(mailSetupService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<MailSetupResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody MailSetupUpsertRequest request
    ) {
        return ApiResponse.ok(mailSetupService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        mailSetupService.softDelete(id);
    }
}