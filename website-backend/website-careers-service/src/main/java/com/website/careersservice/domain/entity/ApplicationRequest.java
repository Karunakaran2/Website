package com.website.careersservice.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "application_request")
public class ApplicationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "career_id")
    private Career career;

    private String name;
    private String email;
    private String mobile;

    @Column(name = "resume_path")
    private String resumePath;

    @Column(name = "submitted_on", nullable = false)
    private Instant submittedOn = Instant.now();

    public Long getId() {
        return id;
    }

    public Career getCareer() {
        return career;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getMobile() {
        return mobile;
    }

    public String getResumePath() {
        return resumePath;
    }

    public Instant getSubmittedOn() {
        return submittedOn;
    }
}