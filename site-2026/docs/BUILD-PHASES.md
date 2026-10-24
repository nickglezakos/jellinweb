# Build Phases

## Phase 0 — Plan (done)

- [x] Folder `web/site-2026/`
- [x] Site plan, pages, file tree, backend integration docs
- [x] Redesign proposal referenced (`../marketing-site-redesign-proposal.md`)

---

## Phase 1 — Scaffold + preserve backend (done)

1. [x] Copy `../app/**` → `site-2026/app/` (full API client + both account types)
2. [x] Copy `../legal/**` → `site-2026/legal/`
3. [x] Copy needed assets into `site-2026/assets/`
4. [x] Stub `index.html` with locked CTAs:
   - Start free → `app/index.html`
   - Become a partner → `app/index.html#referral-login`
5. [ ] Local verify: open stub → both CTAs land in SPA → login/register still hit Azure

**Exit gate:** Backend paths work from the new folder. Visual redesign not required yet.

---

## Phase 2 — Marketing rebuild (done)

1. [x] Full 7-beat `index.html` per `PAGES.md`
2. [x] `css/site.css`, `js/nav.js`, `js/contact-modal.js`, `js/motion.js`
3. [x] Formspree contact modal
4. [x] Sticky nav + footer anchors (no dead links)
5. [x] Responsive pass (mobile menu, story stack, product rail)

**Exit gate:** Marketing matches the proposal; CTAs still correct.

---

## Phase 3 — App chrome (light) (partial)

1. [x] App navbar brand → `../index.html`
2. [ ] Optional: align app gradient / buttons with marketing tokens (no API changes)
3. [ ] Fix any asset path breakages after copy (verify locally)

**Exit gate:** Business + referral smoke tests (see BACKEND-INTEGRATION.md §9).

---

## Phase 4 — Cutover (Option B done locally)

1. [x] **Option B:** Promoted `site-2026/` into `web/` root
   - `index.html`, `css/`, `js/` (marketing)
   - synced `app/`, `legal/`
   - merged needed assets into `assets/`
2. [x] `wrangler.jsonc` left as `"pages_build_output_dir": "."`
3. [ ] Deploy to Cloudflare (commit + push / `wrangler pages deploy`)
4. [ ] Production QA checklist (BACKEND-INTEGRATION.md §9)
5. [x] Backup: `_legacy/index.pre-site-2026.html`

**Canonical source after cutover:** edit files at `web/` root (not only inside `site-2026/`).  
`site-2026/` remains as the plan/sandbox archive until you choose to remove it.

---

## Phase 5 — Optional later

- `pages/partners.html`, `pages/stories.html`
- Display font for marketing headlines
- Story scroll/snap motion
- App visual restyle to match marketing more closely
- Staging API flag in `api.js` (env-based) if non-prod backend appears

---

## Suggested first implementation command set (when building)

```bash
# From web/
cp -R app site-2026/app
cp -R legal site-2026/legal
mkdir -p site-2026/assets && cp -R assets/logos site-2026/assets/
# copy selected jpgs for stories + product…
```

Do not delete live `web/app` until cutover is verified.
