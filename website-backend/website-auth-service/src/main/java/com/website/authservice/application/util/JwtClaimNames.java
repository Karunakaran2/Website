package com.website.authservice.application.util;

public final class JwtClaimNames {

    public static final String AUTHORITIES = "authorities";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String USERNAME = "username";
    public static final String DISPLAY_NAME = "display_name";
    public static final String KEY_ID = "auth-service-1";
    public static final String REVOKE_PREFIX = "auth:revoke:";

    private JwtClaimNames() {
    }
}
