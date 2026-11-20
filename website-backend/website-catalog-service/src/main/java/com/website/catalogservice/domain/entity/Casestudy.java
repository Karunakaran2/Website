package com.website.catalogservice.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "casestudy")
public class Casestudy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;
    private String title;

    @Column(name = "active_status", nullable = false, length = 1)
    private String activeStatus = "Y";

    @Column(name = "posted_on")
    private Instant postedOn;

    @Column(name = "posted_by")
    private String postedBy;

    @Column(name = "image_path")
    private String imagePath;

    @Column(name = "attachment_path")
    private String attachmentPath;

    private String link;

    @Column(name = "blog_banner")
    private String blogBanner;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public Long getId() {
        return id;
    }

    public String getCategory() {
        return category;
    }

    public String getTitle() {
        return title;
    }

    public String getActiveStatus() {
        return activeStatus;
    }

    public Instant getPostedOn() {
        return postedOn;
    }

    public String getPostedBy() {
        return postedBy;
    }

    public String getImagePath() {
        return imagePath;
    }

    public String getAttachmentPath() {
        return attachmentPath;
    }

    public String getLink() {
        return link;
    }

    public String getBlogBanner() {
        return blogBanner;
    }

    public Instant getDeletedAt() {
        return deletedAt;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setActiveStatus(String activeStatus) {
        this.activeStatus = activeStatus;
    }

    public void setPostedOn(Instant postedOn) {
        this.postedOn = postedOn;
    }

    public void setPostedBy(String postedBy) {
        this.postedBy = postedBy;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public void setAttachmentPath(String attachmentPath) {
        this.attachmentPath = attachmentPath;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public void setBlogBanner(String blogBanner) {
        this.blogBanner = blogBanner;
    }

    public void setDeletedAt(Instant deletedAt) {
        this.deletedAt = deletedAt;
    }
}