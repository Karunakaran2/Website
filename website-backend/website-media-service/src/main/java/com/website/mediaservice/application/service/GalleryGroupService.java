package com.website.mediaservice.application.service;

import com.website.mediaservice.application.exception.EntityNotFoundException;
import com.website.mediaservice.domain.entity.GallGroup;
import com.website.mediaservice.domain.repository.GallGroupRepository;
import com.website.mediaservice.web.request.GalleryGroupUpsertRequest;
import com.website.mediaservice.web.response.GalleryGroupResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;

@Service
public class GalleryGroupService {

    private final GallGroupRepository gallGroupRepository;

    public GalleryGroupService(GallGroupRepository gallGroupRepository) {
        this.gallGroupRepository = gallGroupRepository;
    }

    @Transactional(readOnly = true)
    public List<GalleryGroupResponse> listAdmin() {
        return gallGroupRepository.findAll().stream()
                .filter(group -> group.getDeletedAt() == null)
                .map(GalleryGroupResponse::from)
                .toList();
    }

    @Transactional
    public GalleryGroupResponse create(GalleryGroupUpsertRequest request) {
        GallGroup group = new GallGroup();
        apply(group, request);
        return GalleryGroupResponse.from(gallGroupRepository.save(group));
    }

    @Transactional
    public GalleryGroupResponse update(Long groupId, GalleryGroupUpsertRequest request) {
        GallGroup group = gallGroupRepository.findById(groupId)
                .filter(item -> item.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Gallery group not found"));
        apply(group, request);
        return GalleryGroupResponse.from(gallGroupRepository.save(group));
    }

    @Transactional
    public void softDelete(Long groupId) {
        GallGroup group = gallGroupRepository.findById(groupId)
                .filter(item -> item.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Gallery group not found"));
        group.setDeletedAt(Instant.now());
        gallGroupRepository.save(group);
    }

    private static void apply(GallGroup group, GalleryGroupUpsertRequest request) {
        group.setTitle(request.title());
        group.setPostedOn(request.postedOn() != null ? request.postedOn() : Instant.now());
        group.setImagePath(request.imagePath());
        group.setActiveStatus(StringUtils.hasText(request.activeStatus()) ? request.activeStatus() : "Y");
    }
}