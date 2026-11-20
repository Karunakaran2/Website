package com.website.careersservice.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "submitted_resumes")
public class SubmittedResume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String mobile;
    private String exp;

    @Column(columnDefinition = "TEXT")
    private String intro;

    @Column(name = "resume_path")
    private String resumePath;

    @Column(name = "submitted_on", nullable = false)
    private Instant submittedOn = Instant.now();

    private String role;

    public Long getId() {
        return id;
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

    public String getExp() {
        return exp;
    }

    public String getIntro() {
        return intro;
    }

    public String getResumePath() {
        return resumePath;
    }

    public Instant getSubmittedOn() {
        return submittedOn;
    }

    public String getRole() {
        return role;
    }
}