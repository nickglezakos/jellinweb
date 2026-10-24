# Site 2026 cutover (Option B)

**Date:** 2026-10-24

## What changed
- New marketing home is `web/index.html` (promoted from `site-2026/`).
- Marketing styles/scripts: `web/css/site.css`, `web/js/`.
- App + legal synced from `site-2026/` (API client + Start free / referral routes unchanged).
- Old marketing home backed up at `_legacy/index.pre-site-2026.html`.

## Cloudflare
Keep:

```jsonc
"pages_build_output_dir": "."
```

Deploy by committing/pushing this repo (or `wrangler pages deploy` from `web/`). No build-path change.

## Preview before deploy
```bash
cd web && python3 -m http.server 8766
# open http://127.0.0.1:8766/
# Start free → /app/
# Become a partner → /app/#referral-login
```

## After go-live
Edit the **root** files (`index.html`, `css/`, `js/`, `app/`). Treat `site-2026/` as archive/docs unless you intentionally re-promote.
