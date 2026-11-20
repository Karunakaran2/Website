package com.website.catalogservice.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "kran_projects")
public class KranProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;
    private String title;

    @Column(name = "c_status", length = 50)
    private String cStatus;

    @Column(name = "service_con", length = 1)
    private String serviceCon;

    @Column(name = "service_sddwm", length = 1)
    private String serviceSddwm;

    @Column(name = "service_sdd", length = 1)
    private String serviceSdd;

    @Column(name = "service_pi", length = 1)
    private String servicePi;

    @Column(name = "service_oms", length = 1)
    private String serviceOms;

    @Column(name = "service_dm", length = 1)
    private String serviceDm;

    @Column(name = "service_am", length = 1)
    private String serviceAm;

    @Column(name = "service_dbm", length = 1)
    private String serviceDbm;

    @Column(name = "service_tsu", length = 1)
    private String serviceTsu;

    @Column(name = "service_ccn", length = 1)
    private String serviceCcn;

    @Column(name = "service_pas", length = 1)
    private String servicePas;

    @Column(columnDefinition = "text")
    private String sdescription;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "c_description", columnDefinition = "text")
    private String cDescription;

    private String department;
    private String client;

    @Column(name = "image_path")
    private String imagePath;

    @Column(name = "submitted_on")
    private Instant submittedOn;

    @Column(name = "active_status", nullable = false, length = 1)
    private String activeStatus = "Y";

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

    public String getCStatus() {
        return cStatus;
    }

    public String getServiceCon() {
        return serviceCon;
    }

    public String getServiceSddwm() {
        return serviceSddwm;
    }

    public String getServiceSdd() {
        return serviceSdd;
    }

    public String getServicePi() {
        return servicePi;
    }

    public String getServiceOms() {
        return serviceOms;
    }

    public String getServiceDm() {
        return serviceDm;
    }

    public String getServiceAm() {
        return serviceAm;
    }

    public String getServiceDbm() {
        return serviceDbm;
    }

    public String getServiceTsu() {
        return serviceTsu;
    }

    public String getServiceCcn() {
        return serviceCcn;
    }

    public String getServicePas() {
        return servicePas;
    }

    public String getSdescription() {
        return sdescription;
    }

    public String getDescription() {
        return description;
    }

    public String getCDescription() {
        return cDescription;
    }

    public String getDepartment() {
        return department;
    }

    public String getClient() {
        return client;
    }

    public String getImagePath() {
        return imagePath;
    }

    public Instant getSubmittedOn() {
        return submittedOn;
    }

    public String getActiveStatus() {
        return activeStatus;
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

    public void setCStatus(String cStatus) {
        this.cStatus = cStatus;
    }

    public void setServiceCon(String serviceCon) {
        this.serviceCon = serviceCon;
    }

    public void setServiceSddwm(String serviceSddwm) {
        this.serviceSddwm = serviceSddwm;
    }

    public void setServiceSdd(String serviceSdd) {
        this.serviceSdd = serviceSdd;
    }

    public void setServicePi(String servicePi) {
        this.servicePi = servicePi;
    }

    public void setServiceOms(String serviceOms) {
        this.serviceOms = serviceOms;
    }

    public void setServiceDm(String serviceDm) {
        this.serviceDm = serviceDm;
    }

    public void setServiceAm(String serviceAm) {
        this.serviceAm = serviceAm;
    }

    public void setServiceDbm(String serviceDbm) {
        this.serviceDbm = serviceDbm;
    }

    public void setServiceTsu(String serviceTsu) {
        this.serviceTsu = serviceTsu;
    }

    public void setServiceCcn(String serviceCcn) {
        this.serviceCcn = serviceCcn;
    }

    public void setServicePas(String servicePas) {
        this.servicePas = servicePas;
    }

    public void setSdescription(String sdescription) {
        this.sdescription = sdescription;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCDescription(String cDescription) {
        this.cDescription = cDescription;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public void setClient(String client) {
        this.client = client;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public void setSubmittedOn(Instant submittedOn) {
        this.submittedOn = submittedOn;
    }

    public void setActiveStatus(String activeStatus) {
        this.activeStatus = activeStatus;
    }

    public void setDeletedAt(Instant deletedAt) {
        this.deletedAt = deletedAt;
    }
}