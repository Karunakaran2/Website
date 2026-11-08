#!/usr/bin/env python3
"""Copy SRS Flyway baselines into service modules and website-database."""
from __future__ import annotations

import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRS_DDL = ROOT / "documentation" / "SRS" / "postgresql" / "ddl"
DB_ROOT = ROOT / "infrastructure" / "website-database"
BACKEND = ROOT / "website-backend"

MAP = {
    "kran_auth_service": "website-auth-service",
    "kran_content_service": "website-content-service",
    "kran_catalog_service": "website-catalog-service",
    "kran_media_service": "website-media-service",
    "kran_careers_service": "website-careers-service",
    "kran_engagement_service": "website-engagement-service",
    "kran_notification_service": "website-notification-service",
}


def main() -> None:
    dest_ddl = DB_ROOT / "ddl"
    if dest_ddl.exists():
        shutil.rmtree(dest_ddl)
    shutil.copytree(SRS_DDL, dest_ddl)

    arch_src = ROOT / "documentation" / "SRS" / "postgresql" / "PostgreSQL_Database_Architecture.md"
    (DB_ROOT / "architecture").mkdir(parents=True, exist_ok=True)
    shutil.copy2(arch_src, DB_ROOT / "architecture" / "PostgreSQL_Database_Architecture.md")

    for ddl_dir, service_dir in MAP.items():
        src = SRS_DDL / ddl_dir / "V001__baseline.sql"
        if not src.is_file():
            continue
        flyway = BACKEND / service_dir / "src/main/resources/db/migration/V001__baseline.sql"
        flyway.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, flyway)

    print("Synced DDL to", DB_ROOT / "ddl", "and Flyway under each website-*-service folder")


if __name__ == "__main__":
    main()
