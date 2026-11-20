package com.website.contentservice.application.service;

import com.website.contentservice.application.exception.EntityNotFoundException;
import com.website.contentservice.domain.entity.Blog;
import com.website.contentservice.domain.repository.BlogRepository;
import com.website.contentservice.web.request.DataSheetUpsertRequest;
import com.website.contentservice.web.response.DataSheetResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;

@Service
public class DataSheetService {

    private final BlogRepository blogRepository;

    public DataSheetService(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    @Transactional(readOnly = true)
    public List<DataSheetResponse> listAdmin() {
        return blogRepository.findAll().stream()
                .filter(item -> item.getDeletedAt() == null)
                .map(DataSheetResponse::from)
                .toList();
    }

    @Transactional
    public DataSheetResponse create(DataSheetUpsertRequest request) {
        Blog blog = new Blog();
        apply(blog, request);
        return DataSheetResponse.from(blogRepository.save(blog));
    }

    @Transactional
    public DataSheetResponse update(Long id, DataSheetUpsertRequest request) {
        Blog blog = blogRepository.findById(id)
                .filter(item -> item.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Data sheet not found"));
        apply(blog, request);
        return DataSheetResponse.from(blogRepository.save(blog));
    }

    @Transactional
    public void softDelete(Long id) {
        Blog blog = blogRepository.findById(id)
                .filter(item -> item.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("Data sheet not found"));
        blog.setDeletedAt(Instant.now());
        blogRepository.save(blog);
    }

    private static void apply(Blog blog, DataSheetUpsertRequest request) {
        blog.setCategory(request.category());
        blog.setTitle(request.title().trim());
        blog.setPostedOn(request.postedOn() != null ? request.postedOn() : Instant.now());
        blog.setPostedBy(request.postedBy());
        blog.setImagePath(request.imagePath());
        blog.setAttachmentPath(request.attachmentPath());
        blog.setLink(request.link());
        blog.setActiveStatus(StringUtils.hasText(request.activeStatus()) ? request.activeStatus() : "Y");
    }
}