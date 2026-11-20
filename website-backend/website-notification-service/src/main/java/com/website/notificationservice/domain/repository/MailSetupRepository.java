package com.website.notificationservice.domain.repository;

import com.website.notificationservice.domain.entity.MailSetup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MailSetupRepository extends JpaRepository<MailSetup, Long> {
}