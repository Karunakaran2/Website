package com.website.apigateway.infrastructure.config;

import com.website.apigateway.infrastructure.security.RevokedJwtValidator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class GatewaySecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers(HttpMethod.OPTIONS).permitAll()
                        .pathMatchers(
                                "/api/v1/auth/login",
                                "/api/v1/auth/refresh",
                                "/api/v1/auth/.well-known/jwks.json",
                                "/actuator/health",
                                "/actuator/health/**"
                        ).permitAll()
                        .pathMatchers(HttpMethod.GET,
                                "/api/v1/content/**",
                                "/api/v1/catalog/**",
                                "/api/v1/services/**",
                                "/api/v1/solutions/**",
                                "/api/v1/careers/**",
                                "/api/v1/jobs/**",
                                "/api/v1/media/**"
                        ).permitAll()
                        .pathMatchers(HttpMethod.POST,
                                "/api/v1/contact/**",
                                "/api/v1/engagement/**"
                        ).permitAll()
                        .pathMatchers(
                                "/api/v1/health",
                                "/api/v1/health/**"
                        ).permitAll()
                        .pathMatchers("/api/v1/admin/**").authenticated()
                        .pathMatchers("/api/v1/auth/me", "/api/v1/auth/logout").authenticated()
                        .pathMatchers("/api/v1/notifications/**").authenticated()
                        .anyExchange().permitAll())
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
                .build();
    }

    @Bean
    public ReactiveJwtDecoder jwtDecoder(
            StringRedisTemplate stringRedisTemplate,
            @Value("${app.jwt.issuer}") String issuer,
            @Value("${app.jwt.jwk-set-uri}") String jwkSetUri
    ) {
        NimbusReactiveJwtDecoder jwtDecoder = NimbusReactiveJwtDecoder.withJwkSetUri(jwkSetUri).build();
        OAuth2TokenValidator<Jwt> validator = new DelegatingOAuth2TokenValidator<>(
                JwtValidators.createDefaultWithIssuer(issuer),
                new RevokedJwtValidator(stringRedisTemplate)
        );
        jwtDecoder.setJwtValidator(validator);
        return jwtDecoder;
    }
}
