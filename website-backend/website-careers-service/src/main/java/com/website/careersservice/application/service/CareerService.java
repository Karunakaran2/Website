package com.website.careersservice.application.service;

import com.website.careersservice.application.exception.EntityNotFoundException;
import com.website.careersservice.domain.entity.Career;
import com.website.careersservice.domain.repository.CareerRepository;
import com.website.careersservice.web.request.CareerUpsertRequest;
import com.website.careersservice.web.response.CareerResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;

@Service
public class CareerService {

    private final CareerRepository careerRepository;

    public CareerService(CareerRepository careerRepository) {
        this.careerRepository = careerRepository;
    }

    @Transactional(readOnly = true)
    public List<CareerResponse> listAdmin() {
        return careerRepository.findAll().stream()
                .filter(career -> career.getDeletedAt() == null)
                .map(CareerResponse::from)
                .toList();
    }

    @Transactional
    public CareerResponse create(CareerUpsertRequest request) {
        Career career = new Career();
        apply(career, request);
        return CareerResponse.from(careerRepository.save(career));
    }

    @Transactional
    public CareerResponse update(Long id, CareerUpsertRequest request) {
        Career career = careerRepository.findById(id)
                .filter(item -> item.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Career not found"));
        apply(career, request);
        return CareerResponse.from(careerRepository.save(career));
    }

    @Transactional
    public void softDelete(Long id) {
        Career career = careerRepository.findById(id)
                .filter(item -> item.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Career not found"));
        career.setDeletedAt(Instant.now());
        careerRepository.save(career);
    }

    private static void apply(Career career, CareerUpsertRequest request) {
        career.setTitle(request.title());
        career.setJobDescription(request.jobDescription());
        career.setPostedOn(request.postedOn() != null ? request.postedOn() : Instant.now());
        career.setLastDate(request.lastDate());
        career.setSkillSet(request.skillSet());
        career.setLocation(request.location());
        career.setExperience(request.experience());
        career.setActiveStatus(StringUtils.hasText(request.activeStatus()) ? request.activeStatus() : "Y");
    }
}