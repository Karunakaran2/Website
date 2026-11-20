package com.website.mediaservice.application.service;

import com.website.mediaservice.application.exception.EntityNotFoundException;
import com.website.mediaservice.domain.entity.Gallery;
import com.website.mediaservice.domain.repository.GallGroupRepository;
import com.website.mediaservice.domain.repository.GalleryRepository;
import com.website.mediaservice.web.request.GalleryItemUpsertRequest;
import com.website.mediaservice.web.response.GalleryItemResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class GalleryItemService {

    private final GalleryRepository galleryRepository;
    private final GallGroupRepository gallGroupRepository;

    public GalleryItemService(GalleryRepository galleryRepository, GallGroupRepository gallGroupRepository) {
        this.galleryRepository = galleryRepository;
        this.gallGroupRepository = gallGroupRepository;
    }

    @Transactional(readOnly = true)
    public List<GalleryItemResponse> listAdmin() {
        return galleryRepository.findAll().stream()
                .filter(item -> item.getDeletedAt() == null)
                .map(GalleryItemResponse::from)
                .toList();
    }

    @Transactional
    public GalleryItemResponse create(GalleryItemUpsertRequest request) {
        requireGroup(request.groupId());
        Gallery gallery = new Gallery();
        apply(gallery, request);
        return GalleryItemResponse.from(galleryRepository.save(gallery));
    }

    @Transactional
    public GalleryItemResponse update(Long id, GalleryItemUpsertRequest request) {
        requireGroup(request.groupId());
        Gallery gallery = galleryRepository.findById(id)
                .filter(item -> item.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Gallery item not found"));
        apply(gallery, request);
        return GalleryItemResponse.from(galleryRepository.save(gallery));
    }

    @Transactional
    public void softDelete(Long id) {
        Gallery gallery = galleryRepository.findById(id)
                .filter(item -> item.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Gallery item not found"));
        gallery.setDeletedAt(Instant.now());
        galleryRepository.save(gallery);
    }

    private void requireGroup(Long groupId) {
        boolean exists = gallGroupRepository.findById(groupId)
                .filter(group -> group.getDeletedAt() == null)
                .isPresent();
        if (!exists) {
            throw new EntityNotFoundException("Gallery group not found");
        }
    }

    private static void apply(Gallery gallery, GalleryItemUpsertRequest request) {
        gallery.setTitle(request.title());
        gallery.setPostedOn(request.postedOn() != null ? request.postedOn() : Instant.now());
        gallery.setImagePath(request.imagePath());
        gallery.setGroupId(request.groupId());
        gallery.setType(request.type());
    }
}