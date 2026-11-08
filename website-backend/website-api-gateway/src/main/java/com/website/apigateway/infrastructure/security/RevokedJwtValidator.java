package com.website.apigateway.infrastructure.security;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.util.StringUtils;
public class RevokedJwtValidator implements OAuth2TokenValidator<Jwt> {

    static final String REVOKE_PREFIX = "auth:revoke:";

    private final StringRedisTemplate stringRedisTemplate;

    public RevokedJwtValidator(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Override
    public OAuth2TokenValidatorResult validate(Jwt jwt) {
        String jti = jwt.getId();
        if (!StringUtils.hasText(jti)) {
            return OAuth2TokenValidatorResult.success();
        }
        Boolean revoked = stringRedisTemplate.hasKey(REVOKE_PREFIX + jti);
        if (Boolean.TRUE.equals(revoked)) {
            return OAuth2TokenValidatorResult.failure(
                    new OAuth2Error("invalid_token", "Access token has been revoked", null));
        }
        return OAuth2TokenValidatorResult.success();
    }
}
