package com.website.catalogservice.application.service;

import com.website.catalogservice.application.exception.EntityNotFoundException;
import com.website.catalogservice.domain.entity.ProjectProduct;
import com.website.catalogservice.domain.repository.ProjectProductRepository;
import com.website.catalogservice.web.request.ProductUpsertRequest;
import com.website.catalogservice.web.response.ProductResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;

@Service
public class ProductService {

    private final ProjectProductRepository productRepository;

    public ProductService(ProjectProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> listAdmin() {
        return productRepository.findAll().stream()
                .filter(p -> p.getDeletedAt() == null)
                .map(ProductResponse::from)
                .toList();
    }

    @Transactional
    public ProductResponse create(ProductUpsertRequest request) {
        ProjectProduct product = new ProjectProduct();
        apply(product, request);
        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductUpsertRequest request) {
        ProjectProduct product = productRepository.findById(id)
                .filter(p -> p.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
        apply(product, request);
        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public void softDelete(Long id) {
        ProjectProduct product = productRepository.findById(id)
                .filter(p -> p.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
        product.setDeletedAt(Instant.now());
        productRepository.save(product);
    }

    private static void apply(ProjectProduct product, ProductUpsertRequest request) {
        product.setName(request.name());
        product.setTitle(request.title());
        product.setDescription(request.description());
        product.setType(request.type());
        product.setLogo(request.logo());
        product.setCategory(request.category());
        product.setOrderNo(request.orderNo());
        product.setActiveStatus(StringUtils.hasText(request.activeStatus()) ? request.activeStatus() : "Y");
    }
}