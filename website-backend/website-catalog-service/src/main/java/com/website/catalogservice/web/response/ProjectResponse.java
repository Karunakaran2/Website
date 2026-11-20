package com.website.catalogservice.web.response;

import com.website.catalogservice.domain.entity.KranProject;

import java.time.Instant;

public record ProjectResponse(
        Long id,
        String category,
        String title,
        String cStatus,
        String serviceCon,
        String serviceSddwm,
        String serviceSdd,
        String servicePi,
        String serviceOms,
        String serviceDm,
        String serviceAm,
        String serviceDbm,
        String serviceTsu,
        String serviceCcn,
        String servicePas,
        String sdescription,
        String description,
        String cDescription,
        String department,
        String client,
        String imagePath,
        Instant submittedOn,
        String activeStatus
) {

    public static ProjectResponse from(KranProject project) {
        return new ProjectResponse(
                project.getId(),
                project.getCategory(),
                project.getTitle(),
                project.getCStatus(),
                project.getServiceCon(),
                project.getServiceSddwm(),
                project.getServiceSdd(),
                project.getServicePi(),
                project.getServiceOms(),
                project.getServiceDm(),
                project.getServiceAm(),
                project.getServiceDbm(),
                project.getServiceTsu(),
                project.getServiceCcn(),
                project.getServicePas(),
                project.getSdescription(),
                project.getDescription(),
                project.getCDescription(),
                project.getDepartment(),
                project.getClient(),
                project.getImagePath(),
                project.getSubmittedOn(),
                project.getActiveStatus()
        );
    }
}