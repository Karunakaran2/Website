package com.website.authservice.application.service;

import com.website.authservice.web.response.AuthResponse;
import com.website.authservice.web.response.CurrentUserResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface AuthService {

    AuthResponse login(
            String username,
            String password,
            String captchaId,
            String captcha,
            HttpServletRequest request
    );

    AuthResponse refresh(String refreshToken);

    void logout(HttpServletRequest request);

    CurrentUserResponse currentUser(HttpServletRequest request);

    void changePassword(HttpServletRequest request, String currentPassword, String newPassword);
}
