package com.website.authservice.infrastructure.config;

import com.website.authservice.application.util.JwtClaimNames;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.security.converter.RsaKeyConverters;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import java.io.IOException;
import java.io.InputStream;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

@Configuration
public class JwtKeyConfig {

    private final AppProperties appProperties;
    private final ResourceLoader resourceLoader;

    public JwtKeyConfig(AppProperties appProperties, ResourceLoader resourceLoader) {
        this.appProperties = appProperties;
        this.resourceLoader = resourceLoader;
    }

    @Bean
    public RSAKey rsaKey() {
        RSAPublicKey publicKey = readPublicKey(appProperties.getJwt().getPublicKeyLocation());
        RSAPrivateKey privateKey = readPrivateKey(appProperties.getJwt().getPrivateKeyLocation());
        return new RSAKey.Builder(publicKey)
                .privateKey(privateKey)
                .keyID(JwtClaimNames.KEY_ID)
                .build();
    }

    @Bean
    public JwtEncoder jwtEncoder(RSAKey rsaKey) {
        return new NimbusJwtEncoder(new ImmutableJWKSet<SecurityContext>(new JWKSet(rsaKey)));
    }

    @Bean
    public JwtDecoder jwtDecoder(RSAKey rsaKey) {
        try {
            NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withPublicKey(rsaKey.toRSAPublicKey()).build();
            jwtDecoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(appProperties.getJwt().getIssuer()));
            return jwtDecoder;
        } catch (JOSEException exception) {
            throw new IllegalStateException("Unable to build JWT decoder", exception);
        }
    }

    @Bean
    public JWKSet jwkSet(RSAKey rsaKey) {
        return new JWKSet(rsaKey.toPublicJWK());
    }

    private RSAPublicKey readPublicKey(String location) {
        try (InputStream inputStream = open(location)) {
            return RsaKeyConverters.x509().convert(inputStream);
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to read JWT public key", exception);
        }
    }

    private RSAPrivateKey readPrivateKey(String location) {
        try (InputStream inputStream = open(location)) {
            return RsaKeyConverters.pkcs8().convert(inputStream);
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to read JWT private key", exception);
        }
    }

    private InputStream open(String location) throws IOException {
        Resource resource = resourceLoader.getResource(location);
        return resource.getInputStream();
    }
}
