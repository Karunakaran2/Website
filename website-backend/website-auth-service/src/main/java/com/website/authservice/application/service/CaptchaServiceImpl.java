package com.website.authservice.application.service;

import com.website.authservice.application.exception.InvalidCaptchaException;
import com.website.authservice.web.response.CaptchaResponse;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Base64;
import java.util.UUID;

@Service
public class CaptchaServiceImpl implements CaptchaService {

    private static final String REDIS_KEY_PREFIX = "website:captcha:";
    private static final Duration CAPTCHA_TTL = Duration.ofMinutes(5);
    private static final String CAPTCHA_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int CODE_LENGTH = 5;

    private final StringRedisTemplate redisTemplate;
    private final SecureRandom secureRandom = new SecureRandom();

    public CaptchaServiceImpl(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public CaptchaResponse createChallenge() {
        String code = randomCode();
        String captchaId = UUID.randomUUID().toString();
        redisTemplate.opsForValue().set(redisKey(captchaId), code, CAPTCHA_TTL);
        String imageBase64 = "data:image/svg+xml;base64," + Base64.getEncoder().encodeToString(buildSvg(code).getBytes(StandardCharsets.UTF_8));
        return new CaptchaResponse(captchaId, imageBase64);
    }

    @Override
    public void validateAndConsume(String captchaId, String captchaAnswer) {
        if (!StringUtils.hasText(captchaId) || !StringUtils.hasText(captchaAnswer)) {
            throw new InvalidCaptchaException();
        }
        String key = redisKey(captchaId.trim());
        String expected = redisTemplate.opsForValue().get(key);
        redisTemplate.delete(key);
        if (!StringUtils.hasText(expected)) {
            throw new InvalidCaptchaException();
        }
        String normalizedExpected = expected.trim().toUpperCase();
        String normalizedAnswer = captchaAnswer.trim().toUpperCase();
        if (!normalizedExpected.equals(normalizedAnswer)) {
            throw new InvalidCaptchaException();
        }
    }

    private String redisKey(String captchaId) {
        return REDIS_KEY_PREFIX + captchaId;
    }

    private String randomCode() {
        StringBuilder builder = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            builder.append(CAPTCHA_CHARS.charAt(secureRandom.nextInt(CAPTCHA_CHARS.length())));
        }
        return builder.toString();
    }

    private static String buildSvg(String code) {
        return """
                <svg xmlns="http://www.w3.org/2000/svg" width="160" height="50" viewBox="0 0 160 50">
                  <defs>
                    <linearGradient id="bg" x1="0%%" y1="0%%" x2="100%%" y2="100%%">
                      <stop offset="0%%" stop-color="#f8fafc"/>
                      <stop offset="50%%" stop-color="#e2e8f0"/>
                      <stop offset="100%%" stop-color="#edf2f7"/>
                    </linearGradient>
                    <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="#cbd5e1" opacity="0.6"/>
                    </pattern>
                  </defs>
                  <rect width="100%%" height="100%%" fill="url(#bg)" rx="4"/>
                  <rect width="100%%" height="100%%" fill="url(#dots)" rx="4"/>
                  <path d="M 5 25 Q 40 5, 80 25 T 155 20" fill="none" stroke="#94a3b8" stroke-width="1.5" opacity="0.4"/>
                  <path d="M 10 38 Q 50 48, 100 20 T 150 35" fill="none" stroke="#64748b" stroke-width="1" opacity="0.3"/>
                  <text x="18" y="34" font-family="'Courier New', monospace, sans-serif" font-size="26" font-weight="900" letter-spacing="9" fill="#01458e">
                    %s
                  </text>
                </svg>""".formatted(code).trim();
    }
}