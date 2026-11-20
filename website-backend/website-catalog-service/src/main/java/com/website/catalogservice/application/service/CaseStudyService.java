package com.website.catalogservice.application.service;

import com.website.catalogservice.application.exception.EntityNotFoundException;
import com.website.catalogservice.domain.entity.Casestudy;
import com.website.catalogservice.domain.repository.CasestudyRepository;
import com.website.catalogservice.web.request.CaseStudyUpsertRequest;
import com.website.catalogservice.web.response.CaseStudyResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;

@Service
public class CaseStudyService {

    private final CasestudyRepository casestudyRepository;

    public CaseStudyService(CasestudyRepository casestudyRepository) {
        this.casestudyRepository = casestudyRepository;
    }

    @Transactional(readOnly = true)
    public List<CaseStudyResponse> listAdmin() {
        return casestudyRepository.findAll().stream()
                .filter(c -> c.getDeletedAt() == null)
                .map(CaseStudyResponse::from)
                .toList();
    }

    @Transactional
    public CaseStudyResponse create(CaseStudyUpsertRequest request) {
        Casestudy casestudy = new Casestudy();
        apply(casestudy, request);
        return CaseStudyResponse.from(casestudyRepository.save(casestudy));
    }

    @Transactional
    public CaseStudyResponse update(Long id, CaseStudyUpsertRequest request) {
        Casestudy casestudy = casestudyRepository.findById(id)
                .filter(c -> c.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Case study not found"));
        apply(casestudy, request);
        return CaseStudyResponse.from(casestudyRepository.save(casestudy));
    }

    @Transactional
    public void softDelete(Long id) {
        Casestudy casestudy = casestudyRepository.findById(id)
                .filter(c -> c.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Case study not found"));
        casestudy.setDeletedAt(Instant.now());
        casestudyRepository.save(casestudy);
    }

    private static void apply(Casestudy casestudy, CaseStudyUpsertRequest request) {
        casestudy.setCategory(request.category());
        casestudy.setTitle(request.title());
        casestudy.setPostedOn(request.postedOn());
        casestudy.setPostedBy(request.postedBy());
        casestudy.setImagePath(request.imagePath());
        casestudy.setAttachmentPath(request.attachmentPath());
        casestudy.setLink(request.link());
        casestudy.setBlogBanner(request.blogBanner());
        casestudy.setActiveStatus(StringUtils.hasText(request.activeStatus()) ? request.activeStatus() : "Y");
    }
}