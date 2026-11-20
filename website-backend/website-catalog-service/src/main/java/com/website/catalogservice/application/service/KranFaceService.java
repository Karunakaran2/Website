package com.website.catalogservice.application.service;

import com.website.catalogservice.application.exception.EntityNotFoundException;
import com.website.catalogservice.domain.entity.KranFace;
import com.website.catalogservice.domain.repository.KranFaceRepository;
import com.website.catalogservice.web.request.KranFaceUpsertRequest;
import com.website.catalogservice.web.response.KranFaceResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;

@Service
public class KranFaceService {

    private final KranFaceRepository kranFaceRepository;

    public KranFaceService(KranFaceRepository kranFaceRepository) {
        this.kranFaceRepository = kranFaceRepository;
    }

    @Transactional(readOnly = true)
    public List<KranFaceResponse> listAdmin() {
        return kranFaceRepository.findAll().stream()
                .filter(f -> f.getDeletedAt() == null)
                .map(KranFaceResponse::from)
                .toList();
    }

    @Transactional
    public KranFaceResponse create(KranFaceUpsertRequest request) {
        KranFace face = new KranFace();
        apply(face, request);
        return KranFaceResponse.from(kranFaceRepository.save(face));
    }

    @Transactional
    public KranFaceResponse update(Long id, KranFaceUpsertRequest request) {
        KranFace face = kranFaceRepository.findById(id)
                .filter(f -> f.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Kran face not found"));
        apply(face, request);
        return KranFaceResponse.from(kranFaceRepository.save(face));
    }

    @Transactional
    public void softDelete(Long id) {
        KranFace face = kranFaceRepository.findById(id)
                .filter(f -> f.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Kran face not found"));
        face.setDeletedAt(Instant.now());
        kranFaceRepository.save(face);
    }

    private static void apply(KranFace face, KranFaceUpsertRequest request) {
        face.setTitle(request.title());
        face.setName(request.name());
        face.setStatus(request.status());
        face.setImagePath(request.imagePath());
        face.setSubmittedOn(request.submittedOn());
        face.setActiveStatus(StringUtils.hasText(request.activeStatus()) ? request.activeStatus() : "Y");
    }
}