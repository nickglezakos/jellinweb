# Jellin Site 2026

Complete rebuild plan for [jellinapp.com](https://jellinapp.com/) — marketing + web app + legal — keeping existing backend integrations.

**Status:** Option B cutover applied — **canonical site is now `web/` root** (`../index.html`, etc.)  
**This folder:** plan/docs + sandbox archive (do not deploy as Pages root)  
**Visual / copy direction:** `../marketing-site-redesign-proposal.md`  
**Preview live tree:** from `web/`, `python3 -m http.server 8766` → http://127.0.0.1:8766/  
**Cloudflare:** keep `pages_build_output_dir: "."` — deploy the repo root after commit/push

---

## What this folder is

A self-contained plan (and later build home) for the full public site:

| Surface | Audience | Backend? |
|---------|----------|----------|
| Marketing landing | Prospects, young marketers, partners | Contact form only (Formspree) |
| Business app (`/app`) | Business operators | **Yes — Azure API** |
| Referral app (`/app#referral-*`) | Referral partners | **Yes — Azure API** |
| Legal | Everyone | None (static) |

**Critical:** “Start free” and “Become a partner” must keep wiring into the existing SPA + API. Do not replace those with dead links or marketing-only forms.

---

## Docs index

| Doc | Purpose |
|-----|---------|
| [docs/SITE-PLAN.md](docs/SITE-PLAN.md) | Full IA, sitemap, audience, deploy |
| [docs/BACKEND-INTEGRATION.md](docs/BACKEND-INTEGRATION.md) | CTA → routes → API → tokens (must preserve) |
| [docs/PAGES.md](docs/PAGES.md) | Section-by-section marketing + app page specs |
| [docs/FILE-TREE.md](docs/FILE-TREE.md) | Target folder layout inside `site-2026/` |
| [docs/BUILD-PHASES.md](docs/BUILD-PHASES.md) | Build order and cutover from current site |
| [docs/CTA-MAP.md](docs/CTA-MAP.md) | Every button → URL → backend or not |

---

## Non-negotiable entry points

```
Marketing CTA “Start free”
  → /app/index.html          (#login by default)
  → register / confirm / dashboard / subscription
  → API: /account/*, /stripe/*

Marketing CTA “Become a partner” (was “Be a Jellin Referral”)
  → /app/index.html#referral-login
  → referral-register / confirm / dashboard / profile
  → API: /referrals/*
```

Details: [docs/BACKEND-INTEGRATION.md](docs/BACKEND-INTEGRATION.md).

---

## What’s already in this folder

| Piece | Status |
|-------|--------|
| `docs/*` | Full site + backend plan |
| `app/` | **Ported** from live `../app` — includes `api.js`, `auth.js`, router, business + referral views |
| `legal/` | Ported from live |
| `assets/` | Logos + key story/product images |
| `index.html` | Stub marketing home with **locked CTAs** into the app |
| `css/`, `js/` | Starter marketing styles + Formspree contact modal |

Live production still serves from `../` until cutover (`docs/BUILD-PHASES.md`).

### Locked CTAs (do not break)

```html
<a href="app/index.html">Start free</a>
<a href="app/index.html#referral-login">Become a partner</a>
```

See [docs/CTA-MAP.md](docs/CTA-MAP.md) and [docs/BACKEND-INTEGRATION.md](docs/BACKEND-INTEGRATION.md).

---

## Relationship to current site

```
web/
├── index.html              ← LIVE marketing (keep until cutover)
├── app/                    ← LIVE SPA + backend client
├── legal/                  ← LIVE legal
├── marketing-site-redesign-proposal.md
└── site-2026/              ← NEW plan + future build
```

Cutover plan: build here → verify CTAs hit production API → swap Cloudflare Pages root or replace files in `web/`.
