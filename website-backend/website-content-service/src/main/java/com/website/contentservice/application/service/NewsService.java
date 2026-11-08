package com.website.contentservice.application.service;

import com.website.contentservice.application.exception.EntityNotFoundException;
import com.website.contentservice.domain.entity.News;
import com.website.contentservice.domain.repository.NewsRepository;
import com.website.contentservice.web.request.NewsUpsertRequest;
import com.website.contentservice.web.response.NewsResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;

@Service
public class NewsService {

    private final NewsRepository newsRepository;

    public NewsService(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    @Transactional(readOnly = true)
    public List<NewsResponse> listPublic() {
        return newsRepository.findByDeletedAtIsNullAndActiveStatusOrderByPublishDateDesc("Y")
                .stream()
                .map(NewsResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<NewsResponse> listAdmin() {
        return newsRepository.findAll().stream()
                .filter(news -> news.getDeletedAt() == null)
                .map(NewsResponse::from)
                .toList();
    }

    @Transactional
    public NewsResponse create(NewsUpsertRequest request) {
        News news = new News();
        apply(news, request);
        return NewsResponse.from(newsRepository.save(news));
    }

    @Transactional
    public NewsResponse update(Long id, NewsUpsertRequest request) {
        News news = newsRepository.findById(id)
                .filter(item -> item.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("News not found"));
        apply(news, request);
        return NewsResponse.from(newsRepository.save(news));
    }

    @Transactional
    public void softDelete(Long id) {
        News news = newsRepository.findById(id)
                .filter(item -> item.getDeletedAt() == null)
                .orElseThrow(() -> new EntityNotFoundException("News not found"));
        news.setDeletedAt(Instant.now());
        newsRepository.save(news);
    }

    private static void apply(News news, NewsUpsertRequest request) {
        news.setTitle(request.title().trim());
        news.setNewsDescription(request.newsDescription());
        news.setPublishDate(request.publishDate() != null ? request.publishDate() : Instant.now());
        news.setImagePath(request.imagePath());
        news.setNewsLink(request.newsLink());
        news.setActiveStatus(StringUtils.hasText(request.activeStatus()) ? request.activeStatus() : "Y");
    }
}
