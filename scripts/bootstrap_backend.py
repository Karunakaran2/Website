#!/usr/bin/env python3
"""Generate Website Spring Boot microservice skeletons (SRS-aligned)."""
from __future__ import annotations

from pathlib import Path

WORKSPACE = Path(__file__).resolve().parents[1]
BACKEND = WORKSPACE / "website-backend"
SPRING_BOOT = "3.3.5"
SPRING_CLOUD = "2023.0.3"
JAVA_VERSION = "21"
GROUP = "com.website"

# (workspace folder, maven artifact / logical service id, uses JPA)
SERVICES = [
    ("website-api-gateway", "api-gateway", False),
    ("website-auth-service", "auth-service", True),
    ("website-content-service", "content-service", True),
    ("website-catalog-service", "catalog-service", True),
    ("website-media-service", "media-service", True),
    ("website-careers-service", "careers-service", True),
    ("website-engagement-service", "engagement-service", True),
    ("website-notification-service", "notification-service", True),
]


def pkg(service: str) -> str:
    return service.replace("-", "")


def app_java(service: str, with_jpa: bool) -> str:
    p = pkg(service)
    imports = "import org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\n"
    if with_jpa:
        imports += "import org.springframework.boot.autoconfigure.domain.EntityScan;\n"
    ann = "@SpringBootApplication"
    if with_jpa:
        ann += f"(scanBasePackages = \"com.website.{p}\")"
    return f"""package com.website.{p};

{imports}
{ann}
public class {''.join(w.capitalize() for w in p.split())}Application {{
    public static void main(String[] args) {{
        SpringApplication.run({''.join(w.capitalize() for w in p.split())}Application.class, args);
    }}
}}
"""


def pom_service(service: str, with_jpa: bool) -> str:
    artifact = service
    deps = """
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
"""
    h2_test = """
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>test</scope>
        </dependency>
"""
    if service == "api-gateway":
        deps = """
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-gateway</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
"""
    elif with_jpa:
        deps += """
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-core</artifactId>
        </dependency>
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-database-postgresql</artifactId>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.6.0</version>
        </dependency>
""" + h2_test
    else:
        deps += """
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
"""

    cloud = ""
    if service == "api-gateway":
        cloud = f"""
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>{SPRING_CLOUD}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
"""
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>{SPRING_BOOT}</version>
        <relativePath/>
    </parent>
    <groupId>{GROUP}</groupId>
    <artifactId>{artifact}</artifactId>
    <version>0.1.0-SNAPSHOT</version>
    <name>{artifact}</name>
    <properties>
        <java.version>{JAVA_VERSION}</java.version>
    </properties>
{cloud}
    <dependencies>{deps}
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
"""


def application_yml(service: str, port: int, schema: str, with_jpa: bool) -> str:
    if service == "api-gateway":
        return f"""server:
  port: {port}
spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: http://localhost:8081
          predicates:
            - Path=/api/v1/auth/**
management:
  endpoints:
    web:
      exposure:
        include: health,info
"""
    if not with_jpa:
        return f"""server:
  port: {port}
spring:
  application:
    name: {service}
management:
  endpoints:
    web:
      exposure:
        include: health,info
"""
    return f"""server:
  port: {port}
spring:
  application:
    name: {service}
  datasource:
    url: jdbc:postgresql://${{WEBSITE_DB_HOST:localhost}}:${{WEBSITE_DB_PORT:5432}}/${{WEBSITE_DB_NAME:website_db}}?currentSchema={schema}
    username: ${{WEBSITE_DB_USER:website_app}}
    password: ${{WEBSITE_DB_PASSWORD:change_me}}
  jpa:
    hibernate:
      ddl-auto: validate
    open-in-view: false
  flyway:
    enabled: true
    schemas: {schema}
    default-schema: {schema}
    locations: classpath:db/migration
management:
  endpoints:
    web:
      exposure:
        include: health,info
springdoc:
  api-docs:
    path: /api-docs
"""


def health_controller(service: str) -> str:
    p = pkg(service)
    cls = "".join(w.capitalize() for w in p.split()) + "HealthController"
    return f"""package com.website.{p}.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class {cls} {{
    @GetMapping("/api/v1/health")
    public Map<String, String> health() {{
        return Map.of("service", "{service}", "status", "UP");
    }}
}}
"""


def main() -> None:
    schema_map = {
        "auth-service": ("auth", 8081),
        "content-service": ("content", 8082),
        "catalog-service": ("catalog", 8083),
        "media-service": ("media", 8084),
        "careers-service": ("careers", 8085),
        "engagement-service": ("engagement", 8086),
        "notification-service": ("notification", 8087),
        "api-gateway": ("", 8080),
    }

    for folder, service, with_jpa in SERVICES:
        base = BACKEND / folder
        base.mkdir(parents=True, exist_ok=True)
        p = pkg(service)
        java_root = base / "src/main/java/com/website" / p
        for sub in ("controller", "service", "repository", "entity", "dto", "config", "security", "exception"):
            (java_root / sub).mkdir(parents=True, exist_ok=True)
        (java_root / f"{''.join(w.capitalize() for w in p.split())}Application.java").write_text(
            app_java(service, with_jpa), encoding="utf-8"
        )
        if service != "api-gateway":
            (java_root / "controller" / f"{''.join(w.capitalize() for w in p.split())}HealthController.java").write_text(
                health_controller(service), encoding="utf-8"
            )
        schema, port = schema_map[service]
        (base / "src/main/resources").mkdir(parents=True, exist_ok=True)
        (base / "src/main/resources/application.yml").write_text(
            application_yml(service, port, schema, with_jpa), encoding="utf-8"
        )
        if with_jpa:
            (base / "src/main/resources/db/migration").mkdir(parents=True, exist_ok=True)
            (base / "src/main/resources/db/migration/.gitkeep").write_text("", encoding="utf-8")
            test_res = base / "src/test/resources"
            test_res.mkdir(parents=True, exist_ok=True)
            (test_res / "application.yml").write_text(
                """spring:
  datasource:
    url: jdbc:h2:mem:website;MODE=PostgreSQL;DB_CLOSE_DELAY=-1
    driver-class-name: org.h2.Driver
    username: sa
    password:
  jpa:
    hibernate:
      ddl-auto: create-drop
  flyway:
    enabled: false
""",
                encoding="utf-8",
            )
            # append h2 test dependency via pom - handled in pom_service
        (base / "pom.xml").write_text(pom_service(service, with_jpa), encoding="utf-8")
        (base / "src/test/java/com/website" / p).mkdir(parents=True, exist_ok=True)
        if service != "api-gateway":
            sec = java_root / "config" / "DevSecurityConfig.java"
            sec.write_text(security_config(service), encoding="utf-8")
        test_cls = "".join(w.capitalize() for w in p.split()) + "ApplicationTests"
        (base / "src/test/java/com/website" / p / f"{test_cls}.java").write_text(
            application_test(service), encoding="utf-8"
        )

        (base / "README.md").write_text(
            f"# {folder}\n\nStandalone Spring Boot service. Build: `mvn verify` from this directory.\n",
            encoding="utf-8",
        )

    print("Generated standalone microservices under", BACKEND)


def security_config(service: str) -> str:
    p = pkg(service)
    return f"""package com.website.{p}.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@Profile("!prod")
public class DevSecurityConfig {{
    @Bean
    SecurityFilterChain devSecurityFilterChain(HttpSecurity http) throws Exception {{
        http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/health", "/actuator/**", "/api-docs/**", "/swagger-ui/**").permitAll()
                        .anyRequest().authenticated())
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable);
        return http.build();
    }}
}}
"""


def application_test(service: str) -> str:
    p = pkg(service)
    app = "".join(w.capitalize() for w in p.split()) + "Application"
    test = app + "Tests"
    return f"""package com.website.{p};

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class {test} {{
    @Test
    void contextLoads() {{
    }}
}}
"""


if __name__ == "__main__":
    main()
