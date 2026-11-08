#!/usr/bin/env python3
"""Add Eureka client to KRAN service POMs (idempotent). Run fix_eureka_poms.py if DM was corrupted."""
from __future__ import annotations

import re
from pathlib import Path

WORKSPACE = Path(__file__).resolve().parents[1]
BACKEND = WORKSPACE / "website-backend"
SERVICES = [
    "website-auth-service",
    "website-content-service",
    "website-catalog-service",
    "website-media-service",
    "website-careers-service",
    "website-engagement-service",
    "website-notification-service",
]

DM = """
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>2023.0.3</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
"""

EUREKA_DEP = """
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
"""

EUREKA_YML = """
eureka:
  client:
    service-url:
      defaultZone: ${EUREKA_CLIENT_SERVICEURL_DEFAULTZONE:http://localhost:8761/eureka/}
  instance:
    prefer-ip-address: true
"""


def patch_pom(pom: Path) -> None:
    text = pom.read_text(encoding="utf-8")
    if "spring-cloud-dependencies" not in text:
        text = text.replace("    <properties>", DM + "    <properties>", 1)
    if "spring-cloud-starter-netflix-eureka-client" not in text:
        text = text.replace(
            "    <dependencies>\n        <dependency>\n            <groupId>org.springframework.boot</groupId>\n            <artifactId>spring-boot-starter-actuator</artifactId>",
            "    <dependencies>" + EUREKA_DEP + "        <dependency>\n            <groupId>org.springframework.boot</groupId>\n            <artifactId>spring-boot-starter-actuator</artifactId>",
            1,
        )
    pom.write_text(text, encoding="utf-8")


def patch_yml(yml: Path) -> None:
    text = yml.read_text(encoding="utf-8")
    if "eureka:" not in text:
        yml.write_text(text.rstrip() + EUREKA_YML, encoding="utf-8")


def main() -> None:
    for folder in SERVICES:
        base = BACKEND / folder
        patch_pom(base / "pom.xml")
        yml = base / "src/main/resources/application.yml"
        if yml.is_file():
            patch_yml(yml)


if __name__ == "__main__":
    main()
