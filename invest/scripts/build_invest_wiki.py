#!/usr/bin/env python3
"""Build the English Jellin Investor Primer wiki (EyeNet invest UX, EN only)."""

from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "content" / "jellin-investor-primer.html"
ASSET_V = "20261107b"
LOGO = f"/assets/jellin-mark.svg?v={ASSET_V}"

PAGE_ORDER = [
    "",
    "what-is-jellin",
    "where-it-pays",
    "what-changes",
    "the-bet",
    "how-it-is-sold",
    "seed-ladder",
    "footprint",
    "market-validation",
    "addendum-a",
    "addendum-b",
]

SECTIONS = [
    {
        "id": "page-1",
        "slug": "what-is-jellin",
        "num": "01",
        "nav": "What is Jellin",
        "title": "What is Jellin",
        "card": "Who buys and why now — then the platform reasons that cut across every persona.",
    },
    {
        "id": "page-2",
        "slug": "where-it-pays",
        "num": "02",
        "nav": "Where it pays",
        "title": "Where it pays",
        "card": "Highest-value wedges across cafés, gyms, hotels, sports, malls, and agencies.",
    },
    {
        "id": "page-3",
        "slug": "what-changes",
        "num": "03",
        "nav": "What changes",
        "title": "What changes",
        "card": "Friction collapsed, action coupons, partner networks — not another app wall.",
    },
    {
        "id": "page-4",
        "slug": "the-bet",
        "num": "04",
        "nav": "The bet",
        "title": "The bet",
        "card": "Incumbents sell apps and plastic; Jellin sells zero-barrier loyalty and networks.",
    },
    {
        "id": "page-5",
        "slug": "how-it-is-sold",
        "num": "05",
        "nav": "How it is sold",
        "title": "How it is sold",
        "card": "Trial · Standard $20/mo · Enterprise $150–$2,500/mo + connectors.",
    },
    {
        "id": "page-6",
        "slug": "seed-ladder",
        "num": "06",
        "nav": "Seed ladder",
        "title": "Seed ladder — preseed & seed",
        "card": "$150K Greece preseed → $350K U.S. seed with ARR and IRR.",
    },
    {
        "id": "page-7",
        "slug": "footprint",
        "num": "07",
        "nav": "Footprint",
        "title": "Footprint — use of funds",
        "card": "What each raise funds: Greece GTM, then U.S. GTM.",
    },
    {
        "id": "page-8",
        "slug": "market-validation",
        "num": "08",
        "nav": "Market validation",
        "title": "Market validation",
        "card": "~53K Greece + ~285K U.S. core SAM; 5% / 1.5% median penetration.",
    },
    {
        "id": "page-9",
        "slug": "addendum-a",
        "num": "09",
        "nav": "Project status",
        "title": "Project status",
        "card": "Shipped product; funded milestones map to each raise.",
        "group": "addenda",
    },
    {
        "id": "page-10",
        "slug": "addendum-b",
        "num": "10",
        "nav": "Reference",
        "title": "Reference",
        "card": "Fact-checked links for Greece, U.S., and loyalty software markets.",
        "group": "addenda",
    },
]

UI = {
    "site_title": "Jellin Invest",
    "home": "Home",
    "menu": "Menu",
    "browse": "Browse",
    "search_ph": "Search investor primer…",
    "search_label": "Search wiki",
    "no_match": "No matching pages",
    "pdf": "PDF",
    "pdf_title": "Open printable primer (Save as PDF)",
    "pdf_href": "/print/",
    "prev": "Previous",
    "next": "Next",
    "footer": "Jellin · Talos Group · Investor primer · Confidential for investor discussion",
    "home_title": "Jellin Invest",
    "home_lead": (
        "Zero-friction loyalty that enrolls on a phone number or email — "
        "for investor discussion."
    ),
    "hero_eyebrow": "Loyalty · Zero Friction · Cross-Business Rewards",
    "hero_h1": "Jellin investor primer",
    "hero_lead": (
        "Zero-friction loyalty for cafés, gyms, hotels, malls, and sports — "
        "Greece first at 5% median penetration, then the U.S. at 1.5%."
    ),
    "meta": [
        ("Type", "Investor Primer"),
        ("Date", "7 November 2026"),
        ("Structure", "What · Wedges · Changes · Bet · Motions · Seed · Footprint · Market"),
        ("Seed ladder", "$150K → $350K"),
    ],
}


def href(path: str) -> str:
    path = path.strip("/")
    return "/" if not path else f"/{path}/"


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")
    print("wrote", path.relative_to(ROOT))


def strip_section_heads(html: str) -> str:
    return re.sub(r'<div class="section-head">.*?</div>\s*', "", html, flags=re.S)


def extract_cover_and_sections(html: str) -> tuple[str, dict[str, str]]:
    cover_m = re.search(
        r'<section class="cover"[^>]*>(.*?)</section>',
        html,
        flags=re.S,
    )
    cover = cover_m.group(1) if cover_m else ""
    by_id: dict[str, str] = {}
    for m in re.finditer(
        r'<section class="section[^"]*"[^>]*id="(page-\d+)"[^>]*>(.*?)</section>',
        html,
        flags=re.S,
    ):
        by_id[m.group(1)] = strip_section_heads(m.group(2).strip())
    return cover, by_id


def page_label(path: str) -> str:
    path = path.strip("/")
    if not path:
        return UI["home"]
    for sec in SECTIONS:
        if sec["slug"] == path:
            return sec["nav"]
    return path


def pager_html(path: str) -> str:
    path = path.strip("/")
    try:
        idx = PAGE_ORDER.index(path)
    except ValueError:
        return ""
    prev_path = PAGE_ORDER[idx - 1] if idx > 0 else None
    next_path = PAGE_ORDER[idx + 1] if idx + 1 < len(PAGE_ORDER) else None
    prev = (
        f'<a class="pager-link pager-prev" href="{href(prev_path)}" '
        f'aria-label="{UI["prev"]}: {page_label(prev_path)}">'
        f'<span class="pager-dir">{UI["prev"]}</span>'
        f'<span class="pager-title">{page_label(prev_path)}</span></a>'
        if prev_path is not None
        else '<span class="pager-link pager-prev is-empty"></span>'
    )
    nxt = (
        f'<a class="pager-link pager-next" href="{href(next_path)}" '
        f'aria-label="{UI["next"]}: {page_label(next_path)}">'
        f'<span class="pager-dir">{UI["next"]}</span>'
        f'<span class="pager-title">{page_label(next_path)}</span></a>'
        if next_path is not None
        else '<span class="pager-link pager-next is-empty"></span>'
    )
    return f'<nav class="pager" aria-label="Page">{prev}{nxt}</nav>'


def sidebar_html(current: str) -> str:
    def cur(slug: str) -> str:
        return ' aria-current="page"' if current == slug else ""

    primary = [s for s in SECTIONS if s.get("group") != "addenda"]
    addenda = [s for s in SECTIONS if s.get("group") == "addenda"]

    links = [
        f'<a href="/" data-home="true" data-title="{UI["home"]}"{cur("home")}>{UI["home"]}</a>'
    ]
    for sec in primary:
        links.append(
            f'<a href="/{sec["slug"]}/" data-title="{sec["nav"]}"'
            f'{cur(sec["slug"])}>{sec["nav"]}</a>'
        )

    if addenda:
        first_add = addenda[0]["slug"]
        kids = "\n".join(
            f'<a class="nav-child" href="/{sec["slug"]}/" data-title="{sec["nav"]}"'
            f'{cur(sec["slug"])}>{sec["nav"]}</a>'
            for sec in addenda
        )
        links.append(
            f"""
<div class="nav-group is-open" data-nav-group="addenda">
<div class="nav-group-head">
<a class="nav-group-link" href="/{first_add}/" data-title="Addenda"{cur(first_add)}>Addenda</a>
<button type="button" class="nav-group-toggle" aria-expanded="true" aria-controls="nav-group-addenda" aria-label="Toggle Addenda">▾</button>
</div>
<div class="nav-group-body" id="nav-group-addenda">
{kids}
</div>
</div>"""
        )
    return "\n".join(links)


def header_nav(section: str) -> str:
    items = [
        ("home", UI["home"], "/"),
        ("what-is-jellin", "What is Jellin", "/what-is-jellin/"),
        ("where-it-pays", "Where it pays", "/where-it-pays/"),
        ("seed-ladder", "Seed ladder", "/seed-ladder/"),
        ("market-validation", "Market validation", "/market-validation/"),
    ]
    out = []
    for slug, label, url in items:
        ac = ' aria-current="section"' if section == slug else ""
        out.append(f'<a href="{url}"{ac}>{label}</a>')
    return "".join(out)


def render_page(
    *,
    path: str,
    title: str,
    body: str,
    audience: str,
    section: str | None = None,
    wide: bool = True,
) -> str:
    section = section or audience
    page_title = (
        UI["site_title"]
        if title == UI["site_title"]
        else f'{title} — {UI["site_title"]}'
    )
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{page_title}</title>
  <meta name="description" content="{UI["home_lead"]}">
  <link rel="icon" href="/assets/jellin-j-gradient.png?v={ASSET_V}" type="image/png">
  <link rel="stylesheet" href="/assets/site.css?v={ASSET_V}">
</head>
<body data-lang="en" data-audience="{audience}" data-wide="{"true" if wide else "false"}" data-search-index="/assets/search-index.json?v={ASSET_V}">
  <header class="site-header">
    <div class="site-header-inner">
      <div class="header-nav">
        <button type="button" class="sidebar-toggle" id="sidebarToggle" aria-expanded="false" aria-controls="wikiSidebar">{UI["menu"]}</button>
        <a class="brand brand--dual" href="/" aria-label="{UI['site_title']} home">
          <img class="brand-logo brand-logo--jellin" src="/assets/jellin-logo-white.png?v={ASSET_V}" alt="Jellin">
          <span class="brand-sep" aria-hidden="true"></span>
          <img class="brand-logo brand-logo--talos" src="/assets/talos-group-logo.png?v={ASSET_V}" alt="Talos Group">
        </a>
      </div>
      <nav class="header-nav" aria-label="Site sections">{header_nav(section)}
        <a class="pdf-btn" href="{UI["pdf_href"]}" title="{UI["pdf_title"]}">{UI["pdf"]}</a>
      </nav>
    </div>
  </header>
  <div class="sidebar-backdrop" id="sidebarBackdrop"></div>
  <div class="layout">
    <aside class="sidebar" id="wikiSidebar" aria-label="Wiki pages">
      <div class="search-wrap">
        <label class="visually-hidden" for="wikiSearch" style="position:absolute;left:-9999px">{UI["search_label"]}</label>
        <input id="wikiSearch" type="search" placeholder="{UI["search_ph"]}" autocomplete="off" spellcheck="false">
      </div>
      <div class="sidebar-label">{UI["browse"]}</div>
      <nav class="sidebar-nav" id="sidebarNav">
{sidebar_html(audience)}
      </nav>
      <div class="search-empty" id="searchEmpty">{UI["no_match"]}</div>
      <div class="search-hits" id="searchHits"></div>
    </aside>
    <div class="content-wrap">
      <main class="page">
{body}
      </main>
      <footer class="site-footer">
        <div class="site-footer-inner">
          {pager_html(path)}
          <div class="footer-meta">{UI["footer"]}</div>
        </div>
      </footer>
    </div>
  </div>
  <script src="/assets/wiki.js?v={ASSET_V}" defer></script>
</body>
</html>
"""


def page_shell_title(num: str, title: str) -> str:
    return (
        f'<div class="section-head">'
        f'<span class="section-num">{num}</span><h1>{title}</h1></div>\n'
    )


def build_print(src_html: str) -> None:
    html = src_html
    toolbar = """  <div class="no-print toolbar">
    <p style="margin:0"><a href="/">← Back to site</a></p>
    <button type="button" onclick="window.print()">PDF</button>
  </div>
"""
    # Replace whole toolbar block (non-greedy first </div> breaks nested markup).
    old_tb = re.search(
        r'<div class="no-print toolbar">[\s\S]*?</div>\s*(?:<div style="display:flex[^"]*">[\s\S]*?</div>\s*</div>\s*)?',
        html,
    )
    if old_tb:
        html = html[: old_tb.start()] + toolbar + html[old_tb.end() :]
    elif '<div class="no-print toolbar">' in html:
        html = re.sub(
            r'<div class="no-print toolbar">[\s\S]*?(?=<div class="sheet">)',
            toolbar + "\n",
            html,
            count=1,
        )
    write(ROOT / "print" / "index.html", html)


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Missing source primer: {SRC}")
    src_html = SRC.read_text(encoding="utf-8")
    _cover, by_id = extract_cover_and_sections(src_html)
    missing = [s["id"] for s in SECTIONS if s.get("id") and s["id"] not in by_id]
    if missing:
        raise SystemExit(f"Missing primer sections: {missing}")

    search: list[dict] = []

    meta = "".join(
        f"<div><span>{k}</span><strong>{v}</strong></div>" for k, v in UI["meta"]
    )
    cards = "".join(
        f'<a class="landing-card" href="/{sec["slug"]}/">'
        f'<span class="num">{sec["num"]}</span>'
        f'<strong>{sec["nav"]}</strong>'
        f'<span>{sec["card"]}</span></a>'
        for sec in SECTIONS
    )
    home_body = f"""
<div class="hero-band">
  <p class="eyebrow">{UI["hero_eyebrow"]}</p>
  <h1>{UI["hero_h1"]}</h1>
  <p class="lead">{UI["hero_lead"]}</p>
  <div class="hero-meta">{meta}</div>
</div>
<p class="lead">{UI["home_lead"]}</p>
<div class="landing-cards">{cards}</div>
"""
    write(
        ROOT / "index.html",
        render_page(
            path="",
            title=UI["home_title"],
            body=home_body,
            audience="home",
            section="home",
        ),
    )
    search.append(
        {
            "lang": "en",
            "url": "/",
            "title": UI["home_title"],
            "section": UI["home"],
            "sectionSlug": "home",
            "text": re.sub(r"<[^>]+>", " ", home_body),
        }
    )

    for sec in SECTIONS:
        page_title = sec.get("title_override") or sec["title"]
        body = page_shell_title(sec["num"], page_title) + by_id[sec["id"]]
        write(
            ROOT / sec["slug"] / "index.html",
            render_page(
                path=sec["slug"],
                title=sec["nav"],
                body=body,
                audience=sec["slug"],
                section=sec["slug"],
            ),
        )
        search.append(
            {
                "lang": "en",
                "url": f'/{sec["slug"]}/',
                "title": sec["title"],
                "section": sec["nav"],
                "sectionSlug": sec["slug"],
                "text": re.sub(r"<[^>]+>", " ", body),
            }
        )

    write(
        ROOT / "assets" / "search-index.json",
        json.dumps(search, ensure_ascii=False, indent=2),
    )
    print(f"search index entries: {len(search)}")
    build_print(src_html)

    logo = ROOT / "assets" / "talos-group-logo.png"
    jellin = ROOT / "assets" / "jellin-logo-white.png"
    if not logo.exists() or not jellin.exists():
        raise SystemExit(f"Missing logo: {logo}")


if __name__ == "__main__":
    main()
