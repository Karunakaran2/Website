package com.website.catalogservice.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "project_product")
public class ProjectProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    private String type;
    private String logo;

    @Column(name = "active_status", nullable = false, length = 2)
    private String activeStatus = "Y";

    private String category;

    @Column(name = "order_no")
    private Integer orderNo;

    @Column(name = "deleted_at")
    private java.time.Instant deletedAt;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getType() {
        return type;
    }

    public String getLogo() {
        return logo;
    }

    public String getCategory() {
        return category;
    }

    public Integer getOrderNo() {
        return orderNo;
    }

    public String getActiveStatus() {
        return activeStatus;
    }

    public java.time.Instant getDeletedAt() {
        return deletedAt;
    }
}
