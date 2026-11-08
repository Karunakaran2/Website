package com.website.engagementservice.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "contacts")
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String name;

    @Column(nullable = false, length = 300)
    private String email;

    @Column(nullable = false, length = 20)
    private String mobile;

    private String organization;

    private String remarks;

    @Column(name = "request_type", nullable = false, length = 1)
    private String requestType;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "submitted_on", nullable = false)
    private Instant submittedOn = Instant.now();

    public Long getId() {
        return id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public void setRequestType(String requestType) {
        this.requestType = requestType;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }
}
