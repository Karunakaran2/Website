package com.website.contentservice.application.service;

import com.website.contentservice.application.exception.EntityNotFoundException;
import com.website.contentservice.domain.entity.Banner;
import com.website.contentservice.domain.repository.BannerRepository;
import com.website.contentservice.web.request.BannerUpsertRequest;
import com.website.contentservice.web.response.BannerResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;

@Service
public class BannerService {

    private final BannerRepository bannerRepository;

    public BannerService(BannerRepository bannerRepository) {
        this.bannerRepository = bannerRepository;
    }

    @Transactional(readOnly = true)
    public List<BannerResponse> listPublic() {
        return bannerRepository.findByDeletedAtIsNullAndActiveStatusOrderByOrderNoAscIdAsc("Y")
                .stream()
                .map(BannerResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BannerResponse> listAdmin() {
        return bannerRepository.findAll().stream()
                .filter(b -> b.getDeletedAt() == null)
                .map(BannerResponse::from)
                .toList();
    }

    @Transactional
    public BannerResponse create(BannerUpsertRequest request) {
        Banner banner = new Banner();
        apply(banner, request);
        return BannerResponse.from(bannerRepository.save(banner));
    }

    @Transactional
    public BannerResponse update(Long id, BannerUpsertRequest request) {
        Banner banner = bannerRepository.findById(id)
                .filter(b -> b.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Banner not found"));
        apply(banner, request);
        return BannerResponse.from(bannerRepository.save(banner));
    }

    @Transactional
    public void softDelete(Long id) {
        Banner banner = bannerRepository.findById(id)
                .filter(b -> b.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Banner not found"));
        banner.setDeletedAt(Instant.now());
        bannerRepository.save(banner);
    }

    private static void apply(Banner banner, BannerUpsertRequest request) {
        banner.setHeading(request.heading());
        banner.setTitle(request.title().trim());
        banner.setImagePath(request.imagePath());
        banner.setLink(request.link());
        banner.setOrderNo(request.orderNo() != null ? request.orderNo() : 0);
        banner.setActiveStatus(StringUtils.hasText(request.activeStatus()) ? request.activeStatus() : "Y");
    }
}