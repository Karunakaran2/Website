package com.website.authservice.web.response;

public record CaptchaResponse(String captchaId, String imageBase64) {
}