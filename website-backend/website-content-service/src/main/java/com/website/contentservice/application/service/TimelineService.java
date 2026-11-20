package com.website.contentservice.application.service;

import com.website.contentservice.application.exception.EntityNotFoundException;
import com.website.contentservice.domain.entity.KranTimeline;
import com.website.contentservice.domain.repository.KranTimelineRepository;
import com.website.contentservice.web.request.TimelineUpsertRequest;
import com.website.contentservice.web.response.TimelineResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;

@Service
public class TimelineService {

    private final KranTimelineRepository kranTimelineRepository;

    public TimelineService(KranTimelineRepository kranTimelineRepository) {
        this.kranTimelineRepository = kranTimelineRepository;
    }

    @Transactional(readOnly = true)
    public List<TimelineResponse> listAdmin() {
        return kranTimelineRepository.findAll().stream()
                .filter(item -> item.getDeletedAt() == null)
                .map(TimelineResponse::from)
                .toList();
    }

    @Transactional
    public TimelineResponse create(TimelineUpsertRequest request) {
        KranTimeline timeline = new KranTimeline();
        apply(timeline, request);
        return TimelineResponse.from(kranTimelineRepository.save(timeline));
    }

    @Transactional
    public TimelineResponse update(Long id, TimelineUpsertRequest request) {
        KranTimeline timeline = kranTimelineRepository.findById(id)
                .filter(item -> item.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Timeline entry not found"));
        apply(timeline, request);
        return TimelineResponse.from(kranTimelineRepository.save(timeline));
    }

    @Transactional
    public void softDelete(Long id) {
        KranTimeline timeline = kranTimelineRepository.findById(id)
                .filter(item -> item.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Timeline entry not found"));
        timeline.setDeletedAt(Instant.now());
        kranTimelineRepository.save(timeline);
    }

    private static void apply(KranTimeline timeline, TimelineUpsertRequest request) {
        timeline.setTitle(request.title());
        timeline.setHeading(request.heading());
        timeline.setDescription(request.description());
        timeline.setSubmittedOn(request.submittedOn() != null ? request.submittedOn() : Instant.now());
        timeline.setActiveStatus(StringUtils.hasText(request.activeStatus()) ? request.activeStatus() : "Y");
    }
}