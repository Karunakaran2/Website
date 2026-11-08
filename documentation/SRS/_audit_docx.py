#!/usr/bin/env python3
"""Content audit for KranConsulting SRS DOCX/PDF — forbidden SPFO/reference terms."""
from __future__ import annotations

import re
import sys
import zipfile
from pathlib import Path

FORBIDDEN = [
    (re.compile(r"\bSPFO\b", re.I), "SPFO"),
    (re.compile(r"Seafarer", re.I), "Seafarer"),
    (re.compile(r"Seamen['\u2019]?s Provident", re.I), "Seamen Provident"),
    (re.compile(r"Mobile Application\s*[–-]\s*Software Requirements", re.I), "Mobile Application SRS header"),
    (re.compile(r"Directorate General of Shipping", re.I), "DGS"),
    (re.compile(r"Ministry of Ports", re.I), "Ministry of Ports"),
    (re.compile(r"\bAkshay K J\b", re.I), "SPFO author"),
    (re.compile(r"\bJeffin Joy\b", re.I), "SPFO reviewer"),
    (re.compile(r"\bJibi S\b", re.I), "SPFO approver"),
    (re.compile(r"Nishmitha KV", re.I), "Reference creator metadata"),
    (re.compile(r"spfo\.gov\.in", re.I), "SPFO URL"),
]

ALLOWLIST_SUBSTRINGS = [
    "mobile-app-development",
    "pfms360",
    "probity-financials",
]

HEADER_REQUIRED = "KranConsulting Website – Software Requirements Specification (SRS)"


def _xml_text_nodes_joined(xml: str) -> str:
    return "".join(
        re.findall(r"<(?:\w+:)?t(?:\s[^>]*)?>([^<]*)</(?:\w+:)?t>", xml)
    )


def _is_allowlisted(text: str, match_start: int, match_end: int) -> bool:
    window = text[max(0, match_start - 30) : match_end + 30].lower()
    return any(a in window for a in ALLOWLIST_SUBSTRINGS)


def audit_docx(path: Path) -> list[str]:
    issues: list[str] = []
    if not path.exists():
        return [f"Missing file: {path}"]
    with zipfile.ZipFile(path) as z:
        for name in z.namelist():
            if not (
                name.endswith(".xml")
                or name.endswith(".rels")
                or name.startswith("docProps/")
            ):
                continue
            text = z.read(name).decode("utf-8", "replace")
            for rx, label in FORBIDDEN:
                for m in rx.finditer(text):
                    if _is_allowlisted(text, m.start(), m.end()):
                        continue
                    snippet = text[max(0, m.start() - 25) : m.end() + 25].replace("\n", " ")
                    issues.append(f"{name}: {label}: …{snippet}…")
        # Header check (all header parts)
        for name in z.namelist():
            if not name.startswith("word/header") or not name.endswith(".xml"):
                continue
            text = z.read(name).decode("utf-8", "replace")
            plain = _xml_text_nodes_joined(text)
            if not plain.strip():
                continue
            if "Mobile Application" in plain or "Mobile Applica" in plain:
                issues.append(f"{name}: header still contains 'Mobile Application'")
            if "KranConsulting Website" not in plain:
                issues.append(f"{name}: missing KranConsulting Website in header")
            if "Software Requirements Specification (SRS)" not in plain:
                issues.append(f"{name}: missing SRS title in header")
    return issues


def audit_pdf_text(path: Path) -> list[str]:
    issues: list[str] = []
    if not path.exists():
        return [f"Missing file: {path}"]
    try:
        import pypdf

        reader = pypdf.PdfReader(str(path))
        full = "\n".join(page.extract_text() or "" for page in reader.pages)
    except Exception as exc:
        return [f"PDF text extract failed: {exc}"]
    for rx, label in FORBIDDEN:
        for m in rx.finditer(full):
            if _is_allowlisted(full, m.start(), m.end()):
                continue
            issues.append(f"PDF: {label}")
            break
    if "Mobile Application – Software Requirements" in full:
        issues.append("PDF: Mobile Application SRS header text found")
    if HEADER_REQUIRED not in full and "KranConsulting Website" not in full:
        issues.append("PDF: KranConsulting header title not detected in extracted text (may be image/header)")
    return issues


def main() -> int:
    base = Path(__file__).resolve().parent
    docx = base / "KranConsulting_SRS.docx"
    pdf = base / "KranConsulting_SRS.pdf"
    all_issues = audit_docx(docx) + audit_pdf_text(pdf)
    lines = [
        "KranConsulting SRS content audit",
        "",
        "PASS — no forbidden reference content detected."
        if not all_issues
        else "\n".join(all_issues),
    ]
    print("\n".join(lines))
    return 1 if all_issues else 0


if __name__ == "__main__":
    sys.exit(main())
