package com.website.authservice.application.service;

import com.website.authservice.web.response.CaptchaResponse;

public interface CaptchaService {

    CaptchaResponse createChallenge();

    void validateAndConsume(String captchaId, String captchaAnswer);
}