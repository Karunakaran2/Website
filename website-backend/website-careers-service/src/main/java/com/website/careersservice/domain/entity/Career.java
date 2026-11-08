package com.website.careersservice.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "careers")
public class Career {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(name = "job_description")
    private String jobDescription;

    @Column(name = "active_status", nullable = false, length = 1)
    private String activeStatus = "Y";

    @Column(name = "posted_on")
    private Instant postedOn;

    @Column(name = "last_date")
    private Instant lastDate;

    @Column(name = "skill_set")
    private String skillSet;

    private String location;
    private String experience;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public Instant getPostedOn() {
        return postedOn;
    }

    public Instant getLastDate() {
        return lastDate;
    }

    public String getSkillSet() {
        return skillSet;
    }

    public String getLocation() {
        return location;
    }

    public String getExperience() {
        return experience;
    }
}
