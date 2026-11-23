package com.website.apigateway.infrastructure.audit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
public class CmsAuditGlobalFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(CmsAuditGlobalFilter.class);

    private final WebClient.Builder webClientBuilder;
    private final ReactiveJwtDecoder jwtDecoder;
    private final String ingestSecret;

    public CmsAuditGlobalFilter(
            WebClient.Builder webClientBuilder,
            ReactiveJwtDecoder jwtDecoder,
            @Value("${website.audit.ingest-secret:}") String ingestSecret
    ) {
        this.webClientBuilder = webClientBuilder;
        this.jwtDecoder = jwtDecoder;
        this.ingestSecret = ingestSecret == null ? "" : ingestSecret.trim();
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        HttpMethod method = exchange.getRequest().getMethod();
        String path = exchange.getRequest().getURI().getPath();
        if (!CmsAuditPathMapping.isAuditablePath(path, method) || ingestSecret.isEmpty()) {
            return chain.filter(exchange);
        }

        return chain.filter(exchange).then(Mono.defer(() -> publishIfSuccessful(exchange, method, path)));
    }

    private Mono<Void> publishIfSuccessful(ServerWebExchange exchange, HttpMethod method, String path) {
        HttpStatusCode status = exchange.getResponse().getStatusCode();
        if (status == null || !status.is2xxSuccessful()) {
            return Mono.empty();
        }

        String authorization = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (!StringUtils.hasText(authorization) || !authorization.regionMatches(true, 0, "Bearer ", 0, 7)) {
            return Mono.empty();
        }
        String token = authorization.substring(7).trim();

        return jwtDecoder.decode(token)
                .flatMap(jwt -> sendAudit(jwt, exchange, method, path))
                .onErrorResume(error -> {
                    log.debug("CMS audit skipped: {}", error.getMessage());
                    return Mono.empty();
                });
    }

    private Mono<Void> sendAudit(Jwt jwt, ServerWebExchange exchange, HttpMethod method, String path) {
        String username = jwt.getClaimAsString("username");
        if (!StringUtils.hasText(username)) {
            username = jwt.getSubject();
        }
        UUID actorId = null;
        try {
            actorId = UUID.fromString(jwt.getSubject());
        } catch (IllegalArgumentException ignored) {
            // keep null
        }

        String moduleKey = CmsAuditPathMapping.moduleKeyFor(path);
        String action = CmsAuditPathMapping.actionFor(method);
        String entityId = CmsAuditPathMapping.entityIdFromPath(path);
        String summary = CmsAuditPathMapping.summaryFor(method, path);

        Map<String, Object> body = new HashMap<>();
        if (actorId != null) {
            body.put("actorUserId", actorId);
        }
        body.put("actorUsername", username);
        body.put("action", action);
        body.put("moduleKey", moduleKey);
        body.put("entityType", CmsAuditPathMapping.entityTypeFor(moduleKey));
        body.put("entityId", entityId);
        body.put("summary", summary);
        body.put("ipAddress", resolveClientIp(exchange));
        body.put("userAgent", exchange.getRequest().getHeaders().getFirst(HttpHeaders.USER_AGENT));

        return webClientBuilder.build()
                .post()
                .uri("lb://auth-service/api/v1/internal/audit-events")
                .header("X-Website-Audit-Ingest-Secret", ingestSecret)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Void.class)
                .onErrorResume(error -> {
                    log.warn("Failed to publish CMS audit for {}: {}", path, error.getMessage());
                    return Mono.empty();
                });
    }

    private static String resolveClientIp(ServerWebExchange exchange) {
        String forwarded = exchange.getRequest().getHeaders().getFirst("X-Forwarded-For");
        if (StringUtils.hasText(forwarded)) {
            int comma = forwarded.indexOf(',');
            return comma > 0 ? forwarded.substring(0, comma).trim() : forwarded.trim();
        }
        if (exchange.getRequest().getRemoteAddress() != null
                && exchange.getRequest().getRemoteAddress().getAddress() != null) {
            return exchange.getRequest().getRemoteAddress().getAddress().getHostAddress();
        }
        return null;
    }

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE;
    }
}