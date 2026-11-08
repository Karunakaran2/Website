package com.website.authservice.application.dto;

public record IssuedTokens(String accessToken, String refreshToken, long expiresInSeconds, String accessJti) {
}
