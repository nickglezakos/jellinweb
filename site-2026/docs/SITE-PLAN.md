# Complete Site Plan — Jellin 2026

## 1. Product surfaces (one site)

Jellin on the web is **one Cloudflare Pages site** with three product surfaces that share brand, assets, and legal — but only the app talks to the Azure backend.

```
jellinapp.com/
├── /                         Marketing (redesigned 7-beat page)
├── /app/                     Business + Referral SPA (hash router)
├── /legal/*                  Privacy, Terms, Delete account
└── (optional later)
    ├── /pages/partners.html  Partner explainer (links into referral SPA)
    └── /pages/stories.html   Deep-dive use cases (optional; prefer anchors)
```

Deploy today: Wrangler Pages, `pages_build_output_dir: "."` from `web/`.  
Target: either build inside `site-2026/` and point Pages at it, or copy built files up to `web/` at cutover.

---

## 2. Audiences & primary jobs

| Audience | Job on site | Primary CTA |
|----------|-------------|-------------|
| Business / marketer | Understand product fast → create tenant account | **Start free** → `/app/` |
| Referral partner | Join partner program → earn on intros | **Become a partner** → `/app/#referral-login` |
| Curious / press | Demo before launch | **Get a demo** → contact modal (Formspree) |
| End customer | Not the marketing target; they join via SMS/QR/app of a business | No dedicated marketing funnel |
| Legal / Play Store | Policy & deletion | `/legal/*` |

Young-audience redesign applies to **marketing**. App UX stays functional and familiar; restyle can follow later without breaking API contracts.

---

## 3. Sitemap

### Marketing (`index.html`)

| Anchor / section | ID | Content |
|------------------|----|---------|
| Hero | `#top` | Brand, promise, Start free, Become a partner |
| Proof | `#proof` | 3 short claims |
| Stories | `#stories` | 3–4 cinematic use cases |
| How | `#how` | Capture → Reward → Connect |
| Product | `#product` | Screenshots / SMS / dashboard |
| Trust | `#trust` | Privacy + integrations |
| FAQ | `#faq` | 4 short Q&As |
| Contact / close | `#contact` | Demo CTA + modal |
| Footer | — | Product anchors, legal, copyright |

Sticky nav: Logo · Stories · How · Contact · Start free (button)

### App (`/app/index.html` — hash routes)

**Business (Auth)**

| Hash | Auth | Purpose |
|------|------|---------|
| `#login` | no | Business sign-in (**default for Start free**) |
| `#register` | no | Create tenant / business account |
| `#confirm-email` | no | Activation key |
| `#forgot-password` | no | Reset via OTP |
| `#dashboard` | yes | Home after login |
| `#subscription` | yes | Stripe products / checkout |
| `#profile` | yes | Account settings / delete |

**Referral (ReferralAuth)**

| Hash | Auth | Purpose |
|------|------|---------|
| `#referral-login` | no | Partner sign-in (**Become a partner**) |
| `#referral-register` | no | Create referral account |
| `#referral-confirm-email` | no | Activation |
| `#referral-forgot-password` | no | Reset |
| `#referral-dashboard` | yes | Tenants / partner home |
| `#referral-profile` | yes | Partner profile |

Router source of truth today: `web/app/js/app.js`. **Port as-is** into `site-2026/app/`.

### Legal

| Path | Notes |
|------|-------|
| `/legal/privacy.html` | Keep canonical URLs |
| `/legal/terms.html` | Keep canonical URLs |
| `/legal/delete-account.html` | Required for Play Store; keep path |

---

## 4. Navigation rules

1. Marketing never embeds login forms that call the API. It **links out** to `/app/`.
2. App links back to marketing via logo → `/` or `../index.html`.
3. Referral and business sessions use **separate** localStorage keys — never mix.
4. Unknown `/app` hash → `#login` (business). Partner deep links must include `#referral-login`.
5. Contact/demo is marketing-only (Formspree); it does **not** create accounts.

---

## 5. Brand system (shared)

Keep from live site:

- Gradient: `#a855f7 → #ec4899 → #f59e0b`
- Accents: cyan, emerald, pink, amber
- Slate neutrals; white CTAs on gradient
- Pill primary buttons

Marketing 2026 additions (see redesign proposal):

- Bigger space, fewer cards, full-bleed stories
- Shorter copy
- Optional display font for headlines only
- Sticky translucent nav + 2–3 motion beats

App can keep current `app.css` for phase 1; visual polish is phase 3+.

---

## 6. External services

| Service | Used by | Notes |
|---------|---------|-------|
| Azure API (`jellinprd-gr-…azurewebsites.net/api`) | `/app` only | See BACKEND-INTEGRATION.md |
| Stripe (via API) | Subscription view | Checkout URL from API |
| Formspree `xdalrjdj` | Marketing contact modal | Demo requests |
| Google Fonts | Marketing + app | Inter today |
| Cloudflare Pages | Hosting | `wrangler.jsonc` |

---

## 7. Success criteria for “complete site”

- [ ] New marketing page matches 7-beat structure and short copy
- [ ] **Start free** opens business login/register and can register against production API
- [ ] **Become a partner** opens referral login and can login/register against `/referrals/*`
- [ ] Stripe subscription flow still works after login
- [ ] Contact modal still submits email
- [ ] Legal pages reachable with same paths
- [ ] Mobile + desktop marketing layouts work
- [ ] No broken footer `#` placeholders (real anchors or removed)

---

## 8. Out of scope (v1 of site-2026)

- Native mobile apps
- New backend endpoints
- Pricing page (optional later)
- CMS
- Rewriting API client or auth storage keys (would break existing sessions)
