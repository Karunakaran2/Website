#!/usr/bin/env python3
"""Fix dependencyManagement corrupted by add_eureka_to_services.py."""
from __future__ import annotations

import re
from pathlib import Path

WORKSPACE = Path(__file__).resolve().parents[1]
BACKEND = WORKSPACE / "website-backend"
FOLDERS = [
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

EUREKA = """
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
"""


def fix(pom: Path) -> None:
    text = pom.read_text(encoding="utf-8")
    text = re.sub(r"\s*<dependencyManagement>.*?</dependencyManagement>\s*", "\n", text, flags=re.S)
    text = text.replace("<properties>", DM + "\n    <properties>", 1)
    if "spring-cloud-starter-netflix-eureka-client" not in text:
        text = text.replace(
            "<artifactId>spring-boot-starter-actuator</artifactId>\n        </dependency>",
            "<artifactId>spring-boot-starter-actuator</artifactId>\n        </dependency>" + EUREKA,
            1,
        )
    pom.write_text(text, encoding="utf-8")
    print("fixed", pom.parent.name)


def main() -> None:
    for f in FOLDERS:
        fix(BACKEND / f / "pom.xml")


if __name__ == "__main__":
    main()
