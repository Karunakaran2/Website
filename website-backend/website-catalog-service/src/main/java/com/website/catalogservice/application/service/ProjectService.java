package com.website.catalogservice.application.service;

import com.website.catalogservice.application.exception.EntityNotFoundException;
import com.website.catalogservice.domain.entity.KranProject;
import com.website.catalogservice.domain.repository.KranProjectRepository;
import com.website.catalogservice.web.request.ProjectUpsertRequest;
import com.website.catalogservice.web.response.ProjectResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;

@Service
public class ProjectService {

    private final KranProjectRepository projectRepository;

    public ProjectService(KranProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> listAdmin() {
        return projectRepository.findAll().stream()
                .filter(p -> p.getDeletedAt() == null)
                .map(ProjectResponse::from)
                .toList();
    }

    @Transactional
    public ProjectResponse create(ProjectUpsertRequest request) {
        KranProject project = new KranProject();
        apply(project, request);
        return ProjectResponse.from(projectRepository.save(project));
    }

    @Transactional
    public ProjectResponse update(Long id, ProjectUpsertRequest request) {
        KranProject project = projectRepository.findById(id)
                .filter(p -> p.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
        apply(project, request);
        return ProjectResponse.from(projectRepository.save(project));
    }

    @Transactional
    public void softDelete(Long id) {
        KranProject project = projectRepository.findById(id)
                .filter(p -> p.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
        project.setDeletedAt(Instant.now());
        projectRepository.save(project);
    }

    private static void apply(KranProject project, ProjectUpsertRequest request) {
        project.setCategory(request.category());
        project.setTitle(request.title());
        project.setCStatus(request.cStatus());
        project.setServiceCon(request.serviceCon());
        project.setServiceSddwm(request.serviceSddwm());
        project.setServiceSdd(request.serviceSdd());
        project.setServicePi(request.servicePi());
        project.setServiceOms(request.serviceOms());
        project.setServiceDm(request.serviceDm());
        project.setServiceAm(request.serviceAm());
        project.setServiceDbm(request.serviceDbm());
        project.setServiceTsu(request.serviceTsu());
        project.setServiceCcn(request.serviceCcn());
        project.setServicePas(request.servicePas());
        project.setSdescription(request.sdescription());
        project.setDescription(request.description());
        project.setCDescription(request.cDescription());
        project.setDepartment(request.department());
        project.setClient(request.client());
        project.setImagePath(request.imagePath());
        project.setSubmittedOn(request.submittedOn());
        project.setActiveStatus(StringUtils.hasText(request.activeStatus()) ? request.activeStatus() : "Y");
    }
}