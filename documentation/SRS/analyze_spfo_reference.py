#!/usr/bin/env python3
"""Extract formatting properties from SPFO reference SRS DOCX (read-only)."""
from __future__ import annotations

import json
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

NS = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "wp": "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "pic": "http://schemas.openxmlformats.org/drawingml/2006/picture",
}

REF = Path(r"C:\Users\Karunakaran\Downloads\SRS (SPFO - Mobile Application) 2026 07 31 Ver 1.0.docx")


def q(tag: str) -> str:
    prefix, local = tag.split(":")
    return f"{{{NS[prefix]}}}{local}"


def twips_to_inches(twips: str | None) -> str | None:
    if not twips:
        return None
    try:
        return f"{int(twips) / 1440:.3f} in"
    except ValueError:
        return twips


def half_pt(val: str | None) -> str | None:
    if not val:
        return None
    try:
        return f"{int(val) / 2} pt"
    except ValueError:
        return val


def rgb_from_color(el) -> str | None:
    if el is None:
        return None
    val = el.get(q("w:val"))
    if val and val != "auto":
        return f"#{val}"
    theme = el.find("w:themeColor", NS)
    if theme is not None:
        parts = [f"theme:{theme.get(q('w:val'))}"]
        tint = theme.get(q("w:themeTint"))
        if tint:
            parts.append(f"tint={tint}")
        return " ".join(parts)
    return None


def analyze_styles(styles_xml: bytes) -> list[dict]:
    root = ET.fromstring(styles_xml)
    out = []
    for st in root.findall("w:style", NS):
        sid = st.get(q("w:styleId"))
        stype = st.get(q("w:type"))
        name_el = st.find("w:name", NS)
        name = name_el.get(q("w:val")) if name_el is not None else None
        based = st.find("w:basedOn", NS)
        based_on = based.get(q("w:val")) if based is not None else None
        nxt = st.find("w:next", NS)
        next_style = nxt.get(q("w:val")) if nxt is not None else None
        ppr = st.find("w:pPr", NS)
        rpr = st.find("w:rPr", NS)
        info: dict = {"styleId": sid, "type": stype, "name": name, "basedOn": based_on, "next": next_style}
        if ppr is not None:
            info["pPr"] = ET.tostring(ppr, encoding="unicode")
        if rpr is not None:
            fonts = rpr.find("w:rFonts", NS)
            if fonts is not None:
                info["fonts"] = {k.split("}")[-1]: v for k, v in fonts.attrib.items()}
            sz = rpr.find("w:sz", NS)
            if sz is not None:
                info["size"] = half_pt(sz.get(q("w:val")))
            b = rpr.find("w:b", NS)
            info["bold"] = b is not None
            color = rpr.find("w:color", NS)
            info["color"] = rgb_from_color(color)
            spacing = rpr.find("w:spacing", NS)
            if spacing is not None:
                info["charSpacing"] = spacing.get(q("w:val"))
        out.append(info)
    return out


def analyze_sections(doc_xml: bytes) -> list[dict]:
    root = ET.fromstring(doc_xml)
    body = root.find("w:body", NS)
    if body is None:
        return []
    sections = []
    for sect in body.findall("w:sectPr", NS) + [body.find("w:sectPr", NS)]:
        pass
    # sectPr at end of body and inside pPr
    all_sect = []
    for sect in root.iter(q("w:sectPr")):
        info = {}
        pg_sz = sect.find("w:pgSz", NS)
        if pg_sz is not None:
            info["pageWidth"] = twips_to_inches(pg_sz.get(q("w:w")))
            info["pageHeight"] = twips_to_inches(pg_sz.get(q("w:h")))
            info["orientation"] = "landscape" if pg_sz.get(q("w:orient")) == "landscape" else "portrait"
        pg_mar = sect.find("w:pgMar", NS)
        if pg_mar is not None:
            for attr in ("top", "right", "bottom", "left", "header", "footer", "gutter"):
                v = pg_mar.get(q(f"w:{attr}"))
                if v:
                    info[f"margin_{attr}"] = twips_to_inches(v)
        title_pg = sect.find("w:titlePg", NS)
        info["differentFirstPage"] = title_pg is not None
        hdr = sect.find("w:headerReference", NS)
        ftr = sect.find("w:footerReference", NS)
        if hdr is not None:
            info["headerRef"] = hdr.get(q("r:id")) + " type=" + hdr.get(q("w:type"), "default")
        if ftr is not None:
            info["footerRef"] = ftr.get(q("r:id")) + " type=" + ftr.get(q("w:type"), "default")
        all_sect.append(info)
    return all_sect


def header_footer_text(path_in_zip: str, data: bytes) -> dict:
    root = ET.fromstring(data)
    texts = []
    for t in root.iter(q("w:t")):
        if t.text:
            texts.append(t.text)
    return {"part": path_in_zip, "text": "".join(texts)}


def count_elements(doc_xml: bytes) -> dict:
    root = ET.fromstring(doc_xml)
    counts = {"paragraphs": 0, "tables": 0, "drawings": 0, "pageBreaks": 0, "sectBreaks": 0}
    for p in root.iter(q("w:p")):
        counts["paragraphs"] += 1
        for br in p.iter(q("w:br")):
            if br.get(q("w:type")) == "page":
                counts["pageBreaks"] += 1
        ppr = p.find("w:pPr", NS)
        if ppr is not None and ppr.find("w:sectPr", NS) is not None:
            counts["sectBreaks"] += 1
    for _ in root.iter(q("w:tbl")):
        counts["tables"] += 1
    for _ in root.iter(q("w:drawing")):
        counts["drawings"] += 1
    return counts


def sample_paragraph_styles(doc_xml: bytes, limit: int = 40) -> list[dict]:
    root = ET.fromstring(doc_xml)
    samples = []
    for p in root.findall(".//w:body/w:p", NS):
        if len(samples) >= limit:
            break
        ppr = p.find("w:pPr", NS)
        style = None
        outline = None
        if ppr is not None:
            ps = ppr.find("w:pStyle", NS)
            if ps is not None:
                style = ps.get(q("w:val"))
            ol = ppr.find("w:outlineLvl", NS)
            if ol is not None:
                outline = ol.get(q("w:val"))
        texts = []
        for t in p.iter(q("w:t")):
            if t.text:
                texts.append(t.text)
        text = "".join(texts).strip()
        if not text and style is None:
            continue
        samples.append({"style": style, "outlineLvl": outline, "text": text[:120]})
    return samples


def table_sample(doc_xml: bytes) -> list[dict]:
    root = ET.fromstring(doc_xml)
    tables = []
    for i, tbl in enumerate(root.findall(".//w:tbl", NS)[:5]):
        info = {"index": i, "rows": 0, "cols": 0}
        rows = tbl.findall("w:tr", NS)
        info["rows"] = len(rows)
        if rows:
            info["cols"] = len(rows[0].findall("w:tc", NS))
        tbl_pr = tbl.find("w:tblPr", NS)
        if tbl_pr is not None:
            style = tbl_pr.find("w:tblStyle", NS)
            if style is not None:
                info["tblStyle"] = style.get(q("w:val"))
            borders = tbl_pr.find("w:tblBorders", NS)
            if borders is not None:
                info["hasBorders"] = True
        # first row shading
        if rows:
            tr_pr = rows[0].find("w:trPr", NS)
            if tr_pr is not None:
                info["firstRowTrPr"] = True
            tc = rows[0].find("w:tc", NS)
            if tc is not None:
                shd = tc.find("w:tcPr/w:shd", NS)
                if shd is not None:
                    info["headerShading"] = {
                        "fill": shd.get(q("w:fill")),
                        "val": shd.get(q("w:val")),
                    }
        tables.append(info)
    return tables


def main() -> None:
    if not REF.exists():
        raise SystemExit(f"Reference not found: {REF}")
    report: dict = {"referencePath": str(REF), "fileSize": REF.stat().st_size}
    with zipfile.ZipFile(REF, "r") as z:
        report["zipEntries"] = len(z.namelist())
        doc_xml = z.read("word/document.xml")
        styles_xml = z.read("word/styles.xml")
        settings_xml = z.read("word/settings.xml")
        report["elementCounts"] = count_elements(doc_xml)
        report["sections"] = analyze_sections(doc_xml)
        report["styles"] = analyze_styles(styles_xml)
        report["paragraphSamples"] = sample_paragraph_styles(doc_xml, 60)
        report["tableSamples"] = table_sample(doc_xml)
        hf_parts = [n for n in z.namelist() if n.startswith("word/header") or n.startswith("word/footer")]
        report["headersFooters"] = []
        for part in sorted(hf_parts):
            report["headersFooters"].append(header_footer_text(part, z.read(part)))
        # settings: even/odd headers
        settings_root = ET.fromstring(settings_xml)
        even_odd = settings_root.find("w:evenAndOddHeaders", NS)
        report["evenAndOddHeaders"] = even_odd is not None
        doc_pr = z.read("docProps/core.xml")
        core = ET.fromstring(doc_pr)
        dc = "{http://purl.org/dc/elements/1.1/}"
        cp = "{http://schemas.openxmlformats.org/package/2006/metadata/core-properties}"
        report["core"] = {
            "title": core.find(f"{dc}title").text if core.find(f"{dc}title") is not None else None,
            "creator": core.find(f"{dc}creator").text if core.find(f"{dc}creator") is not None else None,
            "created": core.find(f"{cp}created").text if core.find(f"{cp}created") is not None else None,
        }
        # List style IDs used in document
        style_ids = set()
        root = ET.fromstring(doc_xml)
        for ps in root.iter(q("w:pStyle")):
            style_ids.add(ps.get(q("w:val")))
        report["paragraphStyleIdsUsed"] = sorted(style_ids)
        tbl_styles = set()
        for ts in root.iter(q("w:tblStyle")):
            tbl_styles.add(ts.get(q("w:val")))
        report["tableStyleIdsUsed"] = sorted(tbl_styles)

    out_json = Path(__file__).parent / "_spfo_format_extract.json"
    out_json.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"Wrote {out_json}")
    print(f"Paragraphs: {report['elementCounts']['paragraphs']}, tables: {report['elementCounts']['tables']}")
    print(f"Sections: {len(report['sections'])}")
    print(f"Styles defined: {len(report['styles'])}")
    print(f"P styles used: {report['paragraphStyleIdsUsed'][:20]}...")


if __name__ == "__main__":
    main()
