package com.website.contentservice.web.controller;

import com.website.contentservice.application.service.DataSheetService;
import com.website.contentservice.web.request.DataSheetUpsertRequest;
import com.website.contentservice.web.response.ApiResponse;
import com.website.contentservice.web.response.DataSheetResponse;
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
@RequestMapping("/api/v1/admin/data-sheets")
@Tag(name = "Admin content", description = "CMS data sheet management")
public class AdminDataSheetController {

    private final DataSheetService dataSheetService;

    public AdminDataSheetController(DataSheetService dataSheetService) {
        this.dataSheetService = dataSheetService;
    }

    @GetMapping
    public ApiResponse<List<DataSheetResponse>> list() {
        return ApiResponse.ok(dataSheetService.listAdmin());
    }

    @PostMapping
    public ApiResponse<DataSheetResponse> create(@Valid @RequestBody DataSheetUpsertRequest request) {
        return ApiResponse.ok(dataSheetService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<DataSheetResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody DataSheetUpsertRequest request
    ) {
        return ApiResponse.ok(dataSheetService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        dataSheetService.softDelete(id);
    }
}