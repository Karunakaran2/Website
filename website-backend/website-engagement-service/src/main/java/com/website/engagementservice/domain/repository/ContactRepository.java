package com.website.engagementservice.domain.repository;

import com.website.engagementservice.domain.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Long> {
}
