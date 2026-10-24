# Page & Section Specs

## A. Marketing home — `index.html`

Visual direction: `../marketing-site-redesign-proposal.md`.  
Backend: **links only** for account CTAs; Formspree for demo.

### Sticky nav

| Item | Action |
|------|--------|
| Jellin logo | `#top` |
| Stories | `#stories` |
| How | `#how` |
| Contact | `#contact` |
| Start free | `app/index.html` (button) |

Mobile: hamburger or compact row; Start free always visible.

---

### 1. Hero `#top`

| Element | Spec |
|---------|------|
| Visual | Full-bleed gradient and/or product photo (QR / phone) |
| Brand | Wordmark large — primary signal |
| Headline | Loyalty that sticks. No app required. |
| Support | Phone or email. Points. Coupons. Done. |
| Primary CTA | **Start free** → `app/index.html` |
| Secondary CTA | **Become a partner** → `app/index.html#referral-login` |
| Avoid | Stats, badges, inset cards, long paragraphs |

---

### 2. Proof `#proof`

Three lines, large type, no cards:

1. Number in. Reward out.
2. Works with or without the app.
3. One system across shops, malls, hotels.

---

### 3. Stories `#stories`

**Include 3–4** of: Coffee, Gym, Hotel, Sports, Mall.  
Format: full-bleed (or near-bleed) panel per story.

Per story:

- Label (e.g. Coffee)
- Bold headline (reuse punch lines from live site)
- One sentence outcome
- Optional single SMS/chat mock — **no full dialogue scripts**

Assets (from `../assets/`):

| Story | Prefer |
|-------|--------|
| Coffee | `jellin-everyday-regular-after.jpg` |
| Gym | `jellin-gym-after.jpg` |
| Hotel | `jellin-hotel-after.jpg` |
| Sports | `jellin-jacket-ticket-after.jpg` |
| Mall | `jellin-mall-after.jpg` |

---

### 4. How `#how`

Title: **Three moves. That’s the product.**

| # | Title | Line |
|---|-------|------|
| 1 | Capture | Phone or email. That’s the join. |
| 2 | Reward | Points, coupons, bonuses — same campaign. |
| 3 | Connect | One shop or a whole network. |

Footer row (text only): App · QR · SMS · Email

---

### 5. Product `#product`

Dark / slate–purple band (keep current energy).

- Title: Looks good in their hand.
- Support: SMS, email, or full app — same rewards.
- Visuals: `jellin-analytics-01.jpg`, `jellin-email-01.jpg`, `jellin_customer_shos_01.jpg`, `jellin-qr-coupon-01.jpg`

Horizontal scroll on mobile OK.

---

### 6. Trust `#trust`

Compact two-column or stacked:

- **Privacy by design** — Only phone / email. GDPR-ready. → link `legal/privacy.html`
- **Plugs into your stack** — POS · CRM · ERP · Automation  
  CTA: **Ask about integrations** → `#contact`

Short phrase row (optional): Dual coupons · Cross-business redeem · White-label · Live analytics

---

### 7. FAQ `#faq`

Four items, short answers:

1. Do customers need the app? → No. Phone or email is enough.
2. Can partners share rewards? → Yes. Earn at A, redeem at B.
3. Does it work across locations? → Yes. One program, many stores.
4. How do I see results? → Live redemptions and visits in the dashboard.

Use `<details>` for accessibility (same pattern as live).

---

### 8. Close `#contact`

- Line: Ready when you are. / Let’s jell.
- Button: **Get a demo** → open contact modal (Formspree)
- Small print if needed: Prelaunch · ETA May 2026 (not on the button itself)

Modal: email field, submit, thanks state — port JS from live footer.

---

### Footer

| Column | Links |
|--------|-------|
| Product | `#stories`, `#how`, `#product`, `app/index.html` |
| Partners | `app/index.html#referral-login`, `app/index.html#referral-register` |
| Legal | `legal/privacy.html`, `legal/terms.html`, `legal/delete-account.html` |
| Contact | `#contact` |

No dead `href="#"`.

---

## B. Optional marketing pages (`pages/`)

Defer unless needed:

| File | Purpose |
|------|---------|
| `partners.html` | Longer partner pitch → still CTAs to `#referral-login` / `#referral-register` |
| `stories.html` | All five use cases if home only shows three |

Home anchors are enough for v1.

---

## C. App shell — `app/index.html`

**Port existing SPA.** Spec = current behavior, not a redesign.

### Entry points from marketing

| CTA | Hash after load |
|-----|-----------------|
| Start free | `#login` (default when hash empty) |
| Become a partner | `#referral-login` |

### Business screens (summary)

| Route | UI job | API |
|-------|--------|-----|
| login | Email/password | `Account.login` |
| register | Tenant + email + password + optional referral code | `Account.register` |
| confirm-email | Activation key | `Account.confirmEmail` |
| forgot-password | Email → OTP | reset endpoints |
| dashboard | Post-login home | connection / tenant context |
| subscription | Plans | `Stripe.*` |
| profile | Update / delete | `Account.*` |

### Referral screens (summary)

| Route | UI job | API |
|-------|--------|-----|
| referral-login | Partner sign-in | `Referral.login` |
| referral-register | Code + name + email + password | `Referral.register` |
| referral-confirm-email | Activation | `Referral.confirmEmail` |
| referral-forgot-password | Reset | referral reset endpoints |
| referral-dashboard | Associated tenants | `Referral.getTenants` |
| referral-profile | Profile / delete | `Referral.getMyProfile` etc. |

Navbar: show correct type (business vs referral); logo can link to marketing `/`.

---

## D. Legal — `legal/`

Port `privacy.html`, `terms.html`, `delete-account.html`, `legal.css`.  
Update any absolute links only if domain/path changes. Keep Play Store delete-account URL stable:

`https://jellinapp.com/legal/delete-account.html`
