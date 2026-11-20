package com.website.catalogservice.application.service;

import com.website.catalogservice.application.exception.EntityNotFoundException;
import com.website.catalogservice.domain.entity.KranSenior;
import com.website.catalogservice.domain.repository.KranSeniorRepository;
import com.website.catalogservice.web.request.KranSeniorUpsertRequest;
import com.website.catalogservice.web.response.KranSeniorResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;

@Service
public class KranSeniorService {

    private final KranSeniorRepository kranSeniorRepository;

    public KranSeniorService(KranSeniorRepository kranSeniorRepository) {
        this.kranSeniorRepository = kranSeniorRepository;
    }

    @Transactional(readOnly = true)
    public List<KranSeniorResponse> listAdmin() {
        return kranSeniorRepository.findAll().stream()
                .filter(s -> s.getDeletedAt() == null)
                .map(KranSeniorResponse::from)
                .toList();
    }

    @Transactional
    public KranSeniorResponse create(KranSeniorUpsertRequest request) {
        KranSenior senior = new KranSenior();
        apply(senior, request);
        return KranSeniorResponse.from(kranSeniorRepository.save(senior));
    }

    @Transactional
    public KranSeniorResponse update(Long id, KranSeniorUpsertRequest request) {
        KranSenior senior = kranSeniorRepository.findById(id)
                .filter(s -> s.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Kran senior not found"));
        apply(senior, request);
        return KranSeniorResponse.from(kranSeniorRepository.save(senior));
    }

    @Transactional
    public void softDelete(Long id) {
        KranSenior senior = kranSeniorRepository.findById(id)
                .filter(s -> s.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Kran senior not found"));
        senior.setDeletedAt(Instant.now());
        kranSeniorRepository.save(senior);
    }

    private static void apply(KranSenior senior, KranSeniorUpsertRequest request) {
        senior.setName(request.name());
        senior.setDesignation(request.designation());
        senior.setPosition(request.position());
        senior.setQuotes(request.quotes());
        senior.setExperience(request.experience());
        senior.setJoiningDate(request.joiningDate());
        senior.setImagePath(request.imagePath());
        senior.setSubmittedOn(request.submittedOn());
        senior.setActiveStatus(StringUtils.hasText(request.activeStatus()) ? request.activeStatus() : "Y");
    }
}