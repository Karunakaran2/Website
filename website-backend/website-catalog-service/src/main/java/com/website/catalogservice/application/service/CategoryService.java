package com.website.catalogservice.application.service;

import com.website.catalogservice.application.exception.EntityNotFoundException;
import com.website.catalogservice.domain.entity.Category;
import com.website.catalogservice.domain.repository.CategoryRepository;
import com.website.catalogservice.web.request.CategoryUpsertRequest;
import com.website.catalogservice.web.response.CategoryResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> listAdmin() {
        return categoryRepository.findAll().stream()
                .filter(c -> c.getDeletedAt() == null)
                .map(CategoryResponse::from)
                .toList();
    }

    @Transactional
    public CategoryResponse create(CategoryUpsertRequest request) {
        Category category = new Category();
        apply(category, request);
        return CategoryResponse.from(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryUpsertRequest request) {
        Category category = categoryRepository.findById(id)
                .filter(c -> c.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        apply(category, request);
        return CategoryResponse.from(categoryRepository.save(category));
    }

    @Transactional
    public void softDelete(Long id) {
        Category category = categoryRepository.findById(id)
                .filter(c -> c.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        category.setDeletedAt(Instant.now());
        categoryRepository.save(category);
    }

    private static void apply(Category category, CategoryUpsertRequest request) {
        category.setName(request.name().trim());
        category.setType(request.type());
        category.setActiveStatus(StringUtils.hasText(request.activeStatus()) ? request.activeStatus() : "Y");
    }
}