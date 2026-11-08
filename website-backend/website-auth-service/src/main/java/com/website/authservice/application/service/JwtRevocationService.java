package com.website.authservice.application.service;

import java.time.Instant;

public interface JwtRevocationService {

    void revokeAccessJti(String jti, Instant expiresAt);
}
