package com.website.authservice.application.service;

import com.website.authservice.application.dto.AdminSession;
import com.website.authservice.application.dto.IssuedTokens;

import java.util.Optional;

public interface JwtAccessTokenService {

    IssuedTokens issue(AdminSession session);

    IssuedTokens refresh(String refreshToken);

    Optional<AdminSession> read(String accessToken);

    void revoke(String accessToken);
}
