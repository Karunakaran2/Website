package com.website.catalogservice.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "kran_seniors")
public class KranSenior {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String designation;
    private String position;

    @Column(columnDefinition = "text")
    private String quotes;

    private String experience;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @Column(name = "image_path")
    private String imagePath;

    @Column(name = "active_status", nullable = false, length = 1)
    private String activeStatus = "Y";

    @Column(name = "submitted_on")
    private Instant submittedOn;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDesignation() {
        return designation;
    }

    public String getPosition() {
        return position;
    }

    public String getQuotes() {
        return quotes;
    }

    public String getExperience() {
        return experience;
    }

    public LocalDate getJoiningDate() {
        return joiningDate;
    }

    public String getImagePath() {
        return imagePath;
    }

    public String getActiveStatus() {
        return activeStatus;
    }

    public Instant getSubmittedOn() {
        return submittedOn;
    }

    public Instant getDeletedAt() {
        return deletedAt;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public void setQuotes(String quotes) {
        this.quotes = quotes;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public void setJoiningDate(LocalDate joiningDate) {
        this.joiningDate = joiningDate;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public void setActiveStatus(String activeStatus) {
        this.activeStatus = activeStatus;
    }

    public void setSubmittedOn(Instant submittedOn) {
        this.submittedOn = submittedOn;
    }

    public void setDeletedAt(Instant deletedAt) {
        this.deletedAt = deletedAt;
    }
}