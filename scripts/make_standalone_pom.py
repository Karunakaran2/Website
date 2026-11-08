#!/usr/bin/env python3
"""Rewrite service pom.xml to standalone Spring Boot (no workspace aggregator parent)."""
from __future__ import annotations

import re
from pathlib import Path

WORKSPACE = Path(__file__).resolve().parents[1]
BACKEND = WORKSPACE / "website-backend"
SPRING_BOOT = "3.3.5"
JAVA_VERSION = "21"
GROUP = "com.website"
SPRING_CLOUD = "2023.0.3"

SERVICE_DIRS = [
    "website-api-gateway",
    "website-auth-service",
    "website-content-service",
    "website-catalog-service",
    "website-media-service",
    "website-careers-service",
    "website-engagement-service",
    "website-notification-service",
]


def extract_block(pom: str, start_tag: str, end_tag: str) -> str:
    start = pom.index(start_tag)
    end = pom.index(end_tag, start) + len(end_tag)
    return pom[start:end]


def standalone_pom(artifact_id: str, dependencies_xml: str, *, gateway: bool) -> str:
    cloud = ""
    if gateway:
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
    <artifactId>{artifact_id}</artifactId>
    <version>0.1.0-SNAPSHOT</version>
    <name>{artifact_id}</name>
    <properties>
        <java.version>{JAVA_VERSION}</java.version>
    </properties>
{cloud}
    {dependencies_xml}
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


def main() -> None:
    for folder in SERVICE_DIRS:
        pom_path = BACKEND / folder / "pom.xml"
        if not pom_path.is_file():
            print("Skip (missing):", pom_path)
            continue
        text = pom_path.read_text(encoding="utf-8")
        artifact = re.search(r"<artifactId>([^<]+)</artifactId>\s*\n\s*<name>", text)
        if not artifact:
            artifact = re.search(r"<artifactId>([^<]+)</artifactId>", text)
        artifact_id = artifact.group(1) if artifact else folder.replace("website-", "")
        deps = extract_block(text, "<dependencies>", "</dependencies>")
        gateway = folder == "website-api-gateway"
        pom_path.write_text(standalone_pom(artifact_id, deps, gateway=gateway), encoding="utf-8")
        print("Standalone POM:", pom_path)


if __name__ == "__main__":
    main()
