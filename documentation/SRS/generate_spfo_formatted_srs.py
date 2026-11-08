#!/usr/bin/env python3
"""
Build KranConsulting_SRS.docx from the SPFO reference DOCX template.

Formatting rule: copy the reference package and change content only — preserve cover
artwork, header/footer tables, styles, numbering, section properties, and table designs.
Content source: KranConsulting_SRS_MASTER.md
"""
from __future__ import annotations

import copy
import re
import shutil
import zipfile
from datetime import date
from pathlib import Path
from typing import List, Optional, Tuple
from xml.etree import ElementTree as ET

REFERENCE_DOCX = Path(
    r"C:\Users\Karunakaran\Downloads\SRS (SPFO - Mobile Application) 2026 07 31 Ver 1.0.docx"
)

PROJECT_SHORT = "KranConsulting Website"
PROJECT_LONG = "KranConsulting Website"
DOC_TITLE = f"{PROJECT_SHORT} – Software Requirements Specification (SRS)"
DOC_VERSION = "1.0"
DOC_STATUS = "Draft for Review"
PREPARED_FOR = "KranConsulting"
PREPARED_BY = "Karunakaran S"
REVIEWED_BY = "To be confirmed"
APPROVED_BY = "To be confirmed"
DOC_DATE_DISPLAY = date.today().strftime("%d/%m/%Y")
DOC_DATE_ISO = date.today().isoformat()


def _ordinal_day(n: int) -> str:
    if 11 <= (n % 100) <= 13:
        suffix = "th"
    else:
        suffix = {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")
    return f"{n}{suffix}"


_today = date.today()
DOC_DATE_COVER = f"{_ordinal_day(_today.day)} {_today.strftime('%B, %Y')}"

# Forbidden reference-project strings (package-wide scrub after generation).
FORBIDDEN_LITERAL_REPLACEMENTS: List[Tuple[str, str]] = [
    (
        "Mobile Application \u2013 Software Requirements Specification (SRS)",
        DOC_TITLE,
    ),
    (
        "Mobile Application – Software Requirements Specification (SRS)",
        DOC_TITLE,
    ),
    ("Mobile Application – Software Requirements Specification (SRS)", DOC_TITLE),
    ("Seamen\u2019s Provident Fund Organization", PREPARED_FOR),
    ("Seamen's Provident Fund Organization", PREPARED_FOR),
    ("Seafarer's Provident Fund Organization", PREPARED_FOR),
    ("SPFO Mobile Application", PROJECT_SHORT),
    ("Akshay K J", PREPARED_BY),
    ("Jeffin Joy", PREPARED_BY),
    ("Jibi S", PREPARED_BY),
    ("Nishmitha KV", PREPARED_BY),
    ("SRS Generator", PREPARED_BY),
    ("trial provident", "KranConsulting Website"),
    ("31/07/2026", DOC_DATE_DISPLAY),
    ("31th July, 2026", DOC_DATE_DISPLAY),
]

NS_W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
QN_W = lambda tag: f"{{{NS_W}}}{tag}"


def _replace_in_part_xml(data: bytes, replacements: List[Tuple[str, str]]) -> bytes:
    text = data.decode("utf-8")
    for old, new in replacements:
        text = text.replace(old, new)
    return text.encode("utf-8")


def _apply_literal_replacements_xml(data: bytes) -> bytes:
    text = data.decode("utf-8")
    for old, new in FORBIDDEN_LITERAL_REPLACEMENTS:
        text = text.replace(old, new)
    text = text.replace("Version 1.1", f"Version {DOC_VERSION}")
    text = text.replace("Ver 1. 0", f"Ver {DOC_VERSION}")
    text = text.replace("Ver 1.1", f"Ver {DOC_VERSION}")
    return text.encode("utf-8")


COVER_TEXT_REPLACEMENTS: List[Tuple[str, str]] = [
    ("Mobile Application", PROJECT_LONG),
    ("Version 1.0", f"Version {DOC_VERSION}"),
    ("31th July, 2026", DOC_DATE_DISPLAY),
    ("31/07/2026", DOC_DATE_DISPLAY),
    ("Akshay K J", PREPARED_BY),
]


def _patch_text_nodes(element, replacements: List[Tuple[str, str]]) -> None:
    for t_node in element.iter(QN_W("t")):
        if not t_node.text:
            continue
        for old, new in replacements:
            if old in t_node.text:
                t_node.text = t_node.text.replace(old, new)


def _joined_paragraph_text(paragraph) -> str:
    return "".join(t.text or "" for t in paragraph.iter(QN_W("t")))


def _set_paragraph_text_keep_style(paragraph, new_text: str) -> None:
    """Set paragraph visible text using the first run's formatting (SPFO split-run safe)."""
    runs = list(paragraph.findall(QN_W("r")))
    if not runs:
        run = ET.SubElement(paragraph, QN_W("r"))
        text_el = ET.SubElement(run, QN_W("t"))
        text_el.text = new_text
        return
    first_run = runs[0]
    text_nodes = list(first_run.findall(QN_W("t")))
    if not text_nodes:
        text_el = ET.SubElement(first_run, QN_W("t"))
        text_el.text = new_text
    else:
        text_nodes[0].text = new_text
        if text_nodes[0].text and text_nodes[0].text[0].isspace():
            text_nodes[0].set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
        for extra_t in text_nodes[1:]:
            first_run.remove(extra_t)
    for run in runs[1:]:
        paragraph.remove(run)


def _find_wp_balanced_span(xml: str, start: int) -> Optional[Tuple[int, int]]:
    open_match = re.search(r"<w:p\b", xml[start:])
    if not open_match:
        return None
    pos = start + open_match.start()
    depth = 0
    i = pos
    while i < len(xml):
        if xml.startswith("<w:p", i) and (i + 3 == len(xml) or xml[i + 3] in " >"):
            depth += 1
            i += 3
            continue
        if xml.startswith("</w:p>", i):
            depth -= 1
            i += 6
            if depth == 0:
                return pos, i
            continue
        i += 1
    return None


def _first_body_child_wp_span(xml: str) -> Optional[Tuple[int, int]]:
    body_open = re.search(r"<w:body\b[^>]*>", xml)
    if not body_open:
        return None
    return _find_wp_balanced_span(xml, body_open.end())


def _patch_split_mobile_product_string(text: str, product_name: str) -> str:
    if "Mobile Applica" not in text and "Mobile Application" not in text:
        return text
    text = text.replace(
        "<w:t>Mobile Application</w:t>", f"<w:t>{product_name}</w:t>"
    )
    text = text.replace("<w:t>Mobile Applica</w:t>", f"<w:t>{product_name}</w:t>")
    def _remove_single_run_wt(src: str, wt_text: str) -> str:
        pat = (
            r"<w:r\b[^>]*>"
            r"(?:(?!</w:r>)(?:.|\n))*?"
            r"<w:t(?:\s[^>]*)?>"
            + re.escape(wt_text)
            + r"</w:t>"
            r"(?:(?!</w:r>)(?:.|\n))*?"
            r"</w:r>"
        )
        return re.sub(pat, "", src, flags=re.S)

    text = _remove_single_run_wt(text, "t")
    text = _remove_single_run_wt(text, "ion")
    return text


def _rewrite_cover_version_paragraph(block: str) -> str:
    new_version = f"Version {DOC_VERSION}, Date: {DOC_DATE_COVER}"
    for match in re.finditer(r"(<w:p\b[\s\S]*?</w:p>)", block):
        para = match.group(1)
        if "Version" in para and "Date" in para and "Software Requirements" not in para:
            open_p = re.match(r"(<w:p\b[^>]*>)", para)
            if not open_p:
                continue
            ppr = re.search(r"(<w:pPr>[\s\S]*?</w:pPr>)", para)
            rpr = re.search(r"(<w:rPr>[\s\S]*?</w:rPr>)", para)
            ppr_s = ppr.group(1) if ppr else ""
            rpr_s = rpr.group(1) if rpr else ""
            rebuilt = (
                f"{open_p.group(1)}{ppr_s}<w:r>{rpr_s}"
                f"<w:t>{new_version}</w:t></w:r></w:p>"
            )
            return block.replace(para, rebuilt, 1)
    return block


def _restore_header_footer_parts_from_reference(
    payloads: dict[str, bytes], reference_path: Path
) -> None:
    """Restore SPFO header/footer OOXML after python-docx save (table layout preserved)."""
    parts = (
        "word/header1.xml",
        "word/header2.xml",
        "word/footer1.xml",
        "word/footer2.xml",
    )
    with zipfile.ZipFile(reference_path) as zref:
        for part in parts:
            if part in zref.namelist():
                payloads[part] = zref.read(part)


def _graft_cover_paragraph_from_reference(
    payloads: dict[str, bytes], reference_path: Path
) -> None:
    """Restore template cover OOXML (text box + artwork) after python-docx save."""
    if "word/document.xml" not in payloads:
        return
    with zipfile.ZipFile(reference_path) as zref:
        ref_xml = zref.read("word/document.xml").decode("utf-8")
    out_xml = payloads["word/document.xml"].decode("utf-8")
    ref_span = _first_body_child_wp_span(ref_xml)
    out_span = _first_body_child_wp_span(out_xml)
    if not ref_span or not out_span:
        return
    ref_block = ref_xml[ref_span[0] : ref_span[1]]
    payloads["word/document.xml"] = (
        out_xml[: out_span[0]] + ref_block + out_xml[out_span[1] :]
    ).encode("utf-8")


def _patch_cover_paragraph_text(document_xml: bytes) -> bytes:
    """Replace cover wording only — preserve original w: namespace prefixes and layout."""
    text = document_xml.decode("utf-8")
    span = _first_body_child_wp_span(text)
    if not span:
        return document_xml
    block = text[span[0] : span[1]]
    block = _patch_split_mobile_product_string(block, PROJECT_LONG)
    block = _rewrite_cover_version_paragraph(block)
    for old, new in COVER_TEXT_REPLACEMENTS:
        block = block.replace(old, new)
    text = text[: span[0]] + block + text[span[1] :]
    return text.encode("utf-8")


def _collect_media_targets_from_rels(rels_xml: bytes) -> set[str]:
    targets: set[str] = set()
    root = ET.fromstring(rels_xml)
    ns = "http://schemas.openxmlformats.org/package/2006/relationships"
    for rel in root.findall(f"{{{ns}}}Relationship"):
        target = rel.get("Target") or ""
        if "media/" in target.replace("\\", "/"):
            targets.add("word/" + target.replace("../", "").lstrip("/"))
    return targets


def _purge_unreferenced_media(payloads: dict[str, bytes], names: List[str]) -> None:
    referenced: set[str] = set()
    for name in names:
        if name.endswith(".rels"):
            referenced |= _collect_media_targets_from_rels(payloads[name])
    for name in list(payloads):
        if name.startswith("word/media/") and name not in referenced:
            del payloads[name]


def _rewrite_docprops(payloads: dict[str, bytes]) -> None:
    """Overwrite document properties with KranConsulting metadata."""
    core = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>{DOC_TITLE}</dc:title>
  <dc:subject>Software Requirements Specification</dc:subject>
  <dc:creator>{PREPARED_BY}</dc:creator>
  <cp:lastModifiedBy>{PREPARED_BY}</cp:lastModifiedBy>
  <cp:keywords>KranConsulting, SRS, Website Rebuild</cp:keywords>
  <dc:description>{DOC_STATUS}. Prepared for {PREPARED_FOR}.</dc:description>
  <cp:revision>1</cp:revision>
  <dcterms:created xsi:type="dcterms:W3CDTF">{DOC_DATE_ISO}T00:00:00Z</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">{DOC_DATE_ISO}T00:00:00Z</dcterms:modified>
</cp:coreProperties>
"""
    app = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Template>KranConsulting Website</Template>
  <Application>Microsoft Office Word</Application>
  <DocSecurity>0</DocSecurity>
  <ScaleCrop>false</ScaleCrop>
  <Company>{PREPARED_FOR}</Company>
  <LinksUpToDate>false</LinksUpToDate>
  <SharedDoc>false</SharedDoc>
  <HyperlinksChanged>false</HyperlinksChanged>
  <AppVersion>16.0000</AppVersion>
</Properties>
"""
    payloads["docProps/core.xml"] = core.encode("utf-8")
    if "docProps/app.xml" in payloads:
        payloads["docProps/app.xml"] = app.encode("utf-8")


def sanitize_ooxml_package(
    docx_path: Path, reference_path: Optional[Path] = None
) -> None:
    """Content-only scrub: metadata and SPFO strings — preserve template layout/styles."""
    with zipfile.ZipFile(docx_path, "r") as zin:
        names = zin.namelist()
        payloads = {n: zin.read(n) for n in names}

    _rewrite_docprops(payloads)

    ref_path = reference_path or REFERENCE_DOCX
    if ref_path.exists():
        _graft_cover_paragraph_from_reference(payloads, ref_path)
        _restore_header_footer_parts_from_reference(payloads, ref_path)

    if "word/document.xml" in payloads:
        payloads["word/document.xml"] = _patch_cover_paragraph_text(
            payloads["word/document.xml"]
        )

    for name in list(payloads):
        lower = name.lower()
        if not (lower.endswith(".xml") or lower.endswith(".rels")):
            continue
        try:
            payloads[name] = _apply_literal_replacements_xml(payloads[name])
        except UnicodeDecodeError:
            continue

    for name in list(payloads):
        if name.startswith("word/header") and name.endswith(".xml"):
            hdr = payloads[name].decode("utf-8")
            hdr = _patch_split_mobile_product_string(hdr, PROJECT_SHORT)
            payloads[name] = hdr.encode("utf-8")

    # Remove stale reference hyperlinks (e.g. spfo.gov.in) from relationships.
    for name in list(payloads):
        if not name.endswith(".rels"):
            continue
        rels = payloads[name].decode("utf-8", "replace")
        if "spfo.gov.in" in rels.lower():
            rels = re.sub(
                r'<Relationship[^>]*Target="[^"]*spfo\.gov\.in[^"]*"[^>]*/>',
                "",
                rels,
                flags=re.I,
            )
            payloads[name] = rels.encode("utf-8")

    _purge_unreferenced_media(payloads, names)
    names = [n for n in names if n in payloads]

    with zipfile.ZipFile(docx_path, "w", compression=zipfile.ZIP_DEFLATED) as zout:
        for name in names:
            zout.writestr(name, payloads[name])


def patch_package_metadata(docx_path: Path) -> None:
    """Initial pass before python-docx edits (superseded by sanitize_ooxml_package)."""
    sanitize_ooxml_package(docx_path)


def _set_cell_shading(cell, fill: str = "DEEAF6") -> None:
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn

    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), fill)
    tc_pr.append(shd)


def _style_table_grid(table) -> None:
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn

    tbl = table._tbl
    tbl_pr = tbl.tblPr
    if tbl_pr is None:
        tbl_pr = OxmlElement("w:tblPr")
        tbl.insert(0, tbl_pr)
    style = OxmlElement("w:tblStyle")
    style.set(qn("w:val"), "TableGrid")
    tbl_pr.append(style)
    if table.rows:
        for cell in table.rows[0].cells:
            _set_cell_shading(cell)
            for p in cell.paragraphs:
                p.style = "Table Heading"


def _add_toc_block(doc) -> None:
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn

    for _ in range(3):
        doc.add_paragraph("", style="Normal")
    p_title = doc.add_paragraph("Table of Contents")
    p_title.style = "Title"
    p = doc.add_paragraph()
    p.style = "Normal"
    run = p.add_run()
    fld_begin = OxmlElement("w:fldChar")
    fld_begin.set(qn("w:fldCharType"), "begin")
    run._r.append(fld_begin)
    run2 = p.add_run()
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = r'TOC \o "1-3" \h \z \u'
    run2._r.append(instr)
    run3 = p.add_run()
    fld_sep = OxmlElement("w:fldChar")
    fld_sep.set(qn("w:fldCharType"), "separate")
    run3._r.append(fld_sep)
    p.add_run("Right-click and Update Field to refresh the Table of Contents.")
    run5 = p.add_run()
    fld_end = OxmlElement("w:fldChar")
    fld_end.set(qn("w:fldCharType"), "end")
    run5._r.append(fld_end)
    doc.add_page_break()


def _parse_md_table(lines: List[str]) -> Tuple[List[str], List[List[str]]]:
    header = [c.strip() for c in lines[0].strip().strip("|").split("|")]
    rows: List[List[str]] = []
    for line in lines[2:]:
        if not line.strip().startswith("|"):
            break
        rows.append([c.strip() for c in line.strip().strip("|").split("|")])
    return header, rows


def _add_md_table(doc, header: List[str], rows: List[List[str]]) -> None:
    cols = len(header)
    table = doc.add_table(rows=1 + len(rows), cols=cols)
    table.autofit = True
    _style_table_grid(table)
    for j, h in enumerate(header):
        table.rows[0].cells[j].text = h
    for i, row in enumerate(rows):
        for j in range(min(cols, len(row))):
            cell = table.rows[i + 1].cells[j]
            cell.text = row[j]
            for p in cell.paragraphs:
                p.style = "Default 1.5 Table"


def _append_markdown(doc, md_text: str) -> None:
    lines = md_text.splitlines()
    i = 0
    in_code = False
    table_buf: List[str] = []
    skip_leading_title = True

    def flush_table() -> None:
        nonlocal table_buf
        if len(table_buf) >= 2:
            header, rows = _parse_md_table(table_buf)
            _add_md_table(doc, header, rows)
        table_buf = []

    while i < len(lines):
        line = lines[i].rstrip()
        i += 1

        if table_buf:
            if line.startswith("|"):
                table_buf.append(line)
                continue
            flush_table()

        if line.startswith("```"):
            in_code = not in_code
            continue
        if in_code:
            p = doc.add_paragraph(line)
            p.style = "template"
            continue

        if line.startswith("|") and "---" not in line:
            table_buf = [line]
            continue

        if line.startswith("# "):
            title = line[2:].strip()
            if skip_leading_title and "KranConsulting" in title:
                skip_leading_title = False
                continue
            p = doc.add_paragraph(title)
            p.style = "Style1"
            continue
        if line.startswith("## "):
            p = doc.add_paragraph(line[3:].strip())
            p.style = "head12"
            continue
        if line.startswith("### "):
            p = doc.add_paragraph(line[4:].strip())
            p.style = "head123"
            continue
        if line.startswith("#### "):
            p = doc.add_paragraph(line[5:].strip())
            p.style = "Heading 4"
            continue
        if line.startswith("- ") or line.startswith("* "):
            p = doc.add_paragraph(line[2:].strip())
            p.style = "Default 1.5 Bullet List"
            continue
        if re.match(r"^\d+\.\s", line):
            p = doc.add_paragraph(line.strip())
            p.style = "Default 1.5"
            continue
        if line.strip() == "":
            continue
        if line.strip() == "---":
            continue
        p = doc.add_paragraph(line)
        p.style = "Default 1.5"

    flush_table()


def _set_cell_text_preserve_style(cell, text: str) -> None:
    """Update table cell text without replacing paragraph/table cell styles."""
    if not cell.paragraphs:
        cell.text = text
        return
    para = cell.paragraphs[0]
    if para.runs:
        para.runs[0].text = text
        for run in para.runs[1:]:
            run.text = ""
    else:
        para.add_run(text)
    for extra in cell.paragraphs[1:]:
        extra._element.getparent().remove(extra._element)


def _trim_body_keep_front_matter(doc) -> None:
    """Keep cover (0), version heading (1), version table (2); remove SPFO body; keep sectPr."""
    body = doc.element.body
    children = list(body)
    sect_pr = None
    keep = []
    for idx, ch in enumerate(children):
        if ch.tag == QN_W("sectPr"):
            sect_pr = ch
            continue
        if idx <= 2:
            keep.append(ch)
    for ch in children:
        body.remove(ch)
    for ch in keep:
        body.append(ch)
    if sect_pr is not None:
        body.append(sect_pr)


def _update_version_history_table(doc) -> None:
    if len(doc.tables) < 1:
        return
    tbl = doc.tables[0]
    if len(tbl.rows) < 2:
        return
    row = tbl.rows[1]
    vals = [
        DOC_VERSION,
        f"Initial draft – {DOC_STATUS.lower()}",
        DOC_DATE_DISPLAY,
        PREPARED_BY,
        REVIEWED_BY,
        APPROVED_BY,
    ]
    for i, val in enumerate(vals[: len(row.cells)]):
        _set_cell_text_preserve_style(row.cells[i], val)


def build_kran_srs_docx(
    md_path: Path,
    docx_path: Path,
    reference_path: Path = REFERENCE_DOCX,
) -> None:
    if not reference_path.exists():
        raise FileNotFoundError(f"SPFO reference DOCX not found: {reference_path}")
    if not md_path.exists():
        raise FileNotFoundError(f"Master markdown not found: {md_path}")

    shutil.copy2(reference_path, docx_path)

    from docx import Document

    doc = Document(str(docx_path))
    _trim_body_keep_front_matter(doc)
    _update_version_history_table(doc)
    doc.add_page_break()
    _add_toc_block(doc)

    md_text = md_path.read_text(encoding="utf-8")
    _append_markdown(doc, md_text)

    # Acceptance block (SPFO-style closing)
    doc.add_page_break()
    p = doc.add_paragraph("Acceptance Report")
    p.style = "Style1"
    doc.add_paragraph("Document Acceptance & Sign-Off", style="head123")
    labels = [
        ("Customer", PREPARED_FOR),
        ("Document", DOC_TITLE),
        ("Prepared By", PREPARED_BY),
        ("Version", DOC_VERSION),
        ("Date", DOC_DATE_DISPLAY),
        ("Status", DOC_STATUS),
    ]
    sign = doc.add_table(rows=len(labels), cols=2)
    _style_table_grid(sign)
    for i, (k, v) in enumerate(labels):
        sign.rows[i].cells[0].text = k
        sign.rows[i].cells[1].text = v

    doc.save(docx_path)
    sanitize_ooxml_package(docx_path, reference_path=reference_path)


def _export_pdf_libreoffice(docx_path: Path, pdf_path: Path) -> None:
    import subprocess

    candidates = [
        Path(r"C:\Program Files\LibreOffice\program\soffice.exe"),
        Path(r"C:\Program Files (x86)\LibreOffice\program\soffice.exe"),
    ]
    soffice = next((p for p in candidates if p.exists()), None)
    if soffice is None:
        raise FileNotFoundError("LibreOffice soffice.exe not found")
    out_dir = pdf_path.parent
    subprocess.run(
        [
            str(soffice),
            "--headless",
            "--nologo",
            "--nofirststartwizard",
            "--convert-to",
            "pdf",
            "--outdir",
            str(out_dir),
            str(docx_path.resolve()),
        ],
        check=True,
        capture_output=True,
        text=True,
        timeout=600,
    )
    produced = out_dir / f"{docx_path.stem}.pdf"
    if not produced.exists():
        raise RuntimeError("LibreOffice did not produce a PDF output file")
    if produced.resolve() != pdf_path.resolve():
        if pdf_path.exists():
            pdf_path.unlink()
        produced.replace(pdf_path)


def export_docx_to_pdf(docx_path: Path, pdf_path: Path) -> str:
    """PDF must originate from DOCX. No markdown/reportlab fallback."""
    if pdf_path.exists():
        pdf_path.unlink()
    errors: List[str] = []
    try:
        from docx2pdf import convert

        convert(str(docx_path), str(pdf_path))
        if pdf_path.exists() and pdf_path.stat().st_size > 50_000:
            return "docx2pdf"
        errors.append("docx2pdf: output missing or too small")
    except Exception as exc1:
        errors.append(f"docx2pdf: {exc1}")
    try:
        import win32com.client  # type: ignore

        word = win32com.client.Dispatch("Word.Application")
        word.Visible = False
        doc = word.Documents.Open(str(docx_path.resolve()))
        doc.ExportAsFixedFormat(str(pdf_path.resolve()), ExportFormat=17)
        doc.Close(False)
        word.Quit()
        if pdf_path.exists() and pdf_path.stat().st_size > 50_000:
            return "win32com ExportAsFixedFormat"
        errors.append("win32com: output missing or too small")
    except Exception as exc2:
        errors.append(f"win32com: {exc2}")
    try:
        _export_pdf_libreoffice(docx_path, pdf_path)
        if pdf_path.exists() and pdf_path.stat().st_size > 50_000:
            return "libreoffice soffice --convert-to pdf"
        errors.append("libreoffice: output missing or too small")
    except Exception as exc3:
        errors.append(f"libreoffice: {exc3}")

    note = pdf_path.with_suffix(".pdf.generation.txt")
    note.write_text(
        "PDF generation failed (DOCX is still the master deliverable).\n"
        + "\n".join(errors)
        + f"\nOpen {docx_path.name} in Microsoft Word and export to PDF for best fidelity.\n",
        encoding="utf-8",
    )
    if pdf_path.exists() and pdf_path.stat().st_size <= 50_000:
        pdf_path.unlink()
    raise RuntimeError("; ".join(errors))


def write_formatting_analysis_md(output_path: Path, extract_json: Path) -> None:
    import json

    data = json.loads(extract_json.read_text(encoding="utf-8"))
    sec = data["sections"][0] if data.get("sections") else {}
    hf = {h["part"]: h["text"] for h in data.get("headersFooters", [])}

    def style_row(s: dict) -> str:
        if s.get("type") != "paragraph":
            return ""
        sid = s.get("styleId")
        if sid not in {
            "Heading1",
            "Heading2",
            "Heading3",
            "Heading4",
            "Style1",
            "head12",
            "head123",
            "Default15",
            "Default15BulletList",
            "Default15Table",
            "TableHeading",
            "TableContents",
            "Title",
            "Caption",
            "template",
            "ChapterTitle",
            "TOCHeading",
        }:
            return ""
        fonts = s.get("fonts") or {}
        font = fonts.get("ascii") or fonts.get("hAnsi") or "(theme)"
        return (
            f"| `{sid}` | {s.get('name','')} | {font} | {s.get('size','')} | "
            f"{s.get('bold','')} | {s.get('color','')} |\n"
        )

    style_lines = "".join(style_row(s) for s in data.get("styles", []))

    md = f"""# Reference Document Formatting Analysis

**Reference file:** `{data.get('referencePath')}`  
**Extracted:** automated inspection of DOCX OOXML (`analyze_spfo_reference.py`)  
**Purpose:** Mandatory layout template for `KranConsulting_SRS.docx` (content is KranConsulting-specific; formatting follows SPFO).

---

## 1. Page layout

| Property | Value (from `word/document.xml` / section properties) |
|----------|--------------------------------------------------------|
| Page size | {sec.get('pageWidth', 'N/A')} × {sec.get('pageHeight', 'N/A')} (A4) |
| Orientation | {sec.get('orientation', 'portrait')} |
| Top margin | {sec.get('margin_top', 'N/A')} |
| Bottom margin | {sec.get('margin_bottom', 'N/A')} |
| Left margin | {sec.get('margin_left', 'N/A')} |
| Right margin | {sec.get('margin_right', 'N/A')} |
| Header distance | {sec.get('margin_header', 'N/A')} |
| Footer distance | {sec.get('margin_footer', 'N/A')} |
| Gutter | {sec.get('margin_gutter', '0 in')} |
| Different first page | {sec.get('differentFirstPage', False)} |
| Even/odd headers | {data.get('evenAndOddHeaders', False)} |

---

## 2. Typography and paragraph styles (selected)

| Word styleId | Display name | Font | Size | Bold | Color |
|--------------|--------------|------|------|------|-------|
{style_lines}

**Body text (primary):** `Default15` — 12 pt, 1.5 line spacing (360 twips), before 100 / after 200 twips, justified (`jc both`).

**Bullets:** `Default15BulletList` (based on `Default15`).

**Table body cells:** `Default15Table` — 11 pt, tighter spacing.

**Code / literal blocks in generator:** `template` — Arial 12 pt.

---

## 3. Heading hierarchy and numbering

| Level | StyleId | Visual treatment |
|-------|---------|------------------|
| Chapter (1, 2, 3…) | `Style1` | Based on `ChapterTitle`: Tw Cen MT 20 pt bold, color `#01458E`, bottom border `#01458E`, outline level 0, multilevel list numId 14 |
| Section (x.1) | `head12` | Based on `Heading2`: shaded bar `#C7E2FA`, 18 pt, color `#2F5496`, numId 14 ilvl 1 |
| Subsection (x.1.1) | `head123` | Tw Cen MT 16 pt bold `#01458E`, numId 14 |
| Heading 1 (boxed) | `Heading1` | Tw Cen MT 14 pt bold white on fill/border `#0F6FC6`, page break before, numId 11 |
| Heading 2 (boxed) | `Heading2` | 12 pt bold on `#C7E2FA` border/shading, numId 13 |
| Heading 3–4 | `Heading3` / `Heading4` | Blue tones `#2E74B5`, numId 12 ilvl 2–3 |

**TOC:** `Title` style for “Table of Contents”; entries use `TOC1`, `TOC2`, `TOC3`. Field instruction: `TOC \\o "1-3" \\h \\z \\u`.

---

## 4. Cover page

- Implemented as **first body paragraph** (`w:p` index 0) containing drawing/text-box content (not plain `Title` style text).
- Visible strings include: “Software Requirements Specification”, product name, “Version …”, and date line.
- **KranConsulting generator** copies this paragraph verbatim from the reference package and replaces product name / version / date via controlled string substitution in `word/document.xml`.

---

## 5. Headers and footers

| Part | Text (reference) | KranConsulting replacement |
|------|------------------|----------------------------|
| `word/header1.xml` | {hf.get('word/header1.xml', '')[:80]}… | `{PROJECT_SHORT} – Software Requirements Specification (SRS)` + Confidential |
| `word/footer1.xml` | {hf.get('word/footer1.xml', '')[:60]}… | `Ver {DOC_VERSION}` + page fields |
| `word/header2.xml` / `footer2.xml` | First-page variants (often empty) | Preserved from reference |

Page numbering uses Word field codes (`PAGE`, `NUMPAGES`) embedded in footer runs.

---

## 6. Tables

| Property | Value |
|----------|--------|
| Default table style | `TableGrid` / `TableGrid1` |
| Header row shading | Fill `#DEEAF6` (`w:shd`) |
| Header cell paragraphs | `TableHeading` — 12 pt bold, centered |
| Body cell paragraphs | `TableContents` / `Default15Table` |
| Borders | Full table borders (`w:tblBorders`) on reference tables |

Version History table: **6 columns** — Version, Change Summary, Date, Prepared By, Reviewed By, Approved By.

---

## 7. Figures and captions

- **Caption** style: Tw Cen MT 10 pt, centered, color `#2E74B5`, 1.5 line spacing.
- List of Figures uses `TableofFigures` / `Table Heading` section heading in reference.
- KranConsulting SRS embeds architecture/workflow diagrams primarily in markdown appendices; Word figures should use the same Caption style when inserted manually.

---

## 8. Front matter sequence (reference)

1. Cover (paragraph 0)  
2. “Version History” (`TableHeading`)  
3. Version History table (6 columns)  
4. Page break  
5. “Table of Contents” (`Title`) + TOC field  
6. Main numbered chapters (`Style1` / `head12` / `head123`)  
7. Closing **Acceptance Report** with sign-off tables  

---

## 9. Document statistics (reference)

| Metric | Count |
|--------|------:|
| Paragraphs | {data.get('elementCounts', {}).get('paragraphs', 'N/A')} |
| Tables | {data.get('elementCounts', {}).get('tables', 'N/A')} |
| Drawings | {data.get('elementCounts', {}).get('drawings', 'N/A')} |
| Defined styles | {len(data.get('styles', []))} |

---

## 10. KranConsulting implementation mapping

| Requirement | Implementation |
|-------------|----------------|
| Same template | `shutil.copy2` reference → `KranConsulting_SRS.docx` |
| Preserve styles/headers/theme | No new Word template; OOXML package retained |
| Replace SPFO content | Trim body after version table; inject master markdown |
| Table appearance | `TableGrid` + `#DEEAF6` header shading in generator |
| PDF from DOCX | Word `docx2pdf` / COM export, else LibreOffice `soffice --convert-to pdf` (never markdown/reportlab) |

---

*This analysis must be regenerated if the SPFO reference DOCX is updated.*
"""
    output_path.write_text(md, encoding="utf-8")


if __name__ == "__main__":
    base = Path(__file__).resolve().parent
    extract = base / "_spfo_format_extract.json"
    if not extract.exists():
        import analyze_spfo_reference  # noqa: F401

        analyze_spfo_reference.main()
    write_formatting_analysis_md(base / "Reference_Document_Formatting_Analysis.md", extract)
    master = base / "KranConsulting_SRS_MASTER.md"
    out = base / "KranConsulting_SRS.docx"
    if master.exists():
        build_kran_srs_docx(master, out)
        pdf = base / "KranConsulting_SRS.pdf"
        try:
            method = export_docx_to_pdf(out, pdf)
            print(f"Wrote {out.name}, {pdf.name} via {method}")
        except RuntimeError as e:
            print(e)
