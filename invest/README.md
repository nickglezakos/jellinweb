# Jellin Investor Primer wiki

English-only static investor site (same chrome/UX as the EyeNet invest wiki: sidebar, search, mobile menu, pager).

Content is extracted from `../business/` (Business Overview DOCX/PDF and product companion), including product thesis, personas, modules, Greek market sizing, 3-year financials, and angel scenarios.

## Preview

```bash
cd invest
python3 -m http.server 8768
# open http://127.0.0.1:8768/
```

## Rebuild pages

After editing `content/jellin-investor-primer.html` or `scripts/build_invest_wiki.py`:

```bash
python3 scripts/build_invest_wiki.py
```

## Printable PDF

`/print/` — browser **Print → Save as PDF**.

## Deploy

Point a static host (e.g. Cloudflare Pages) at the `invest` directory. English only at `/`.
