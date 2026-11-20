package com.website.catalogservice.application.service;

import com.website.catalogservice.application.exception.EntityNotFoundException;
import com.website.catalogservice.domain.entity.KranSolution;
import com.website.catalogservice.domain.repository.KranSolutionRepository;
import com.website.catalogservice.web.request.SolutionUpsertRequest;
import com.website.catalogservice.web.response.SolutionResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;

@Service
public class SolutionService {

    private final KranSolutionRepository solutionRepository;

    public SolutionService(KranSolutionRepository solutionRepository) {
        this.solutionRepository = solutionRepository;
    }

    @Transactional(readOnly = true)
    public List<SolutionResponse> listAdmin() {
        return solutionRepository.findAll().stream()
                .filter(s -> s.getDeletedAt() == null)
                .map(SolutionResponse::from)
                .toList();
    }

    @Transactional
    public SolutionResponse create(SolutionUpsertRequest request) {
        KranSolution solution = new KranSolution();
        apply(solution, request);
        return SolutionResponse.from(solutionRepository.save(solution));
    }

    @Transactional
    public SolutionResponse update(Long id, SolutionUpsertRequest request) {
        KranSolution solution = solutionRepository.findById(id)
                .filter(s -> s.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Solution not found"));
        apply(solution, request);
        return SolutionResponse.from(solutionRepository.save(solution));
    }

    @Transactional
    public void softDelete(Long id) {
        KranSolution solution = solutionRepository.findById(id)
                .filter(s -> s.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Solution not found"));
        solution.setDeletedAt(Instant.now());
        solutionRepository.save(solution);
    }

    private static void apply(KranSolution solution, SolutionUpsertRequest request) {
        solution.setCategory(request.category());
        solution.setTitle(request.title());
        solution.setDescription(request.description());
        solution.setImagePath(request.imagePath());
        solution.setActiveStatus(StringUtils.hasText(request.activeStatus()) ? request.activeStatus() : "Y");
    }
}