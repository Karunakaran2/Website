package com.website.notificationservice.application.service;

import com.website.notificationservice.application.exception.EntityNotFoundException;
import com.website.notificationservice.domain.entity.MailSetup;
import com.website.notificationservice.domain.repository.MailSetupRepository;
import com.website.notificationservice.web.request.MailSetupUpsertRequest;
import com.website.notificationservice.web.response.MailSetupResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;

@Service
public class MailSetupService {

    private final MailSetupRepository mailSetupRepository;

    public MailSetupService(MailSetupRepository mailSetupRepository) {
        this.mailSetupRepository = mailSetupRepository;
    }

    @Transactional(readOnly = true)
    public List<MailSetupResponse> listAdmin() {
        return mailSetupRepository.findAll().stream()
                .filter(item -> item.getDeletedAt() == null)
                .map(MailSetupResponse::from)
                .toList();
    }

    @Transactional
    public MailSetupResponse create(MailSetupUpsertRequest request) {
        MailSetup mailSetup = new MailSetup();
        apply(mailSetup, request);
        return MailSetupResponse.from(mailSetupRepository.save(mailSetup));
    }

    @Transactional
    public MailSetupResponse update(Long id, MailSetupUpsertRequest request) {
        MailSetup mailSetup = mailSetupRepository.findById(id)
                .filter(item -> item.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Mail setup not found"));
        apply(mailSetup, request);
        return MailSetupResponse.from(mailSetupRepository.save(mailSetup));
    }

    @Transactional
    public void softDelete(Long id) {
        MailSetup mailSetup = mailSetupRepository.findById(id)
                .filter(item -> item.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Mail setup not found"));
        mailSetup.setDeletedAt(Instant.now());
        mailSetupRepository.save(mailSetup);
    }

    private static void apply(MailSetup mailSetup, MailSetupUpsertRequest request) {
        mailSetup.setType(request.type().trim());
        mailSetup.setMailTo(request.mailTo());
        mailSetup.setMailCc(request.mailCc());
        mailSetup.setAddedOn(request.addedOn() != null ? request.addedOn() : Instant.now());
        mailSetup.setActiveStatus(StringUtils.hasText(request.activeStatus()) ? request.activeStatus() : "Y");
        mailSetup.setDeactivatedOn(request.deactivatedOn());
    }
}