# Backend Integration Plan

This is the contract that the new marketing site **must not break**. All account creation, login, Stripe, and referral logic lives in the **app SPA**, which calls the Azure API.

---

## 1. Marketing CTAs → App entry (preserve)

### Current (live `web/index.html`)

```html
<a href="app/index.html">Get Started Free</a>
<a href="app/index.html#referral-login">Be a Jellin Referral</a>
```

### Target labels (copy change only — same targets)

| New label | `href` | Opens |
|-----------|--------|--------|
| **Start free** | `app/index.html` or `/app/` | Business SPA → default `#login` |
| **Become a partner** | `app/index.html#referral-login` or `/app/#referral-login` | Referral SPA → `#referral-login` |

Optional deep links (same backend):

| Use | `href` |
|-----|--------|
| Jump straight to business signup | `app/index.html#register` |
| Jump straight to partner signup | `app/index.html#referral-register` |

**Rule:** Marketing HTML/JS must not call `API.Account` or `API.Referral`. Only navigate.

---

## 2. Architecture

```
┌─────────────────────────────┐
│  Marketing (index.html)     │
│  Start free / Become partner│
│  Get a demo (Formspree)     │
└─────────────┬───────────────┘
              │ location href only
              ▼
┌─────────────────────────────┐
│  App SPA  /app/index.html   │
│  app.js hash router         │
│  Auth  |  ReferralAuth      │
│  API client (api.js)        │
└─────────────┬───────────────┘
              │ HTTPS JSON + JWT
              ▼
┌─────────────────────────────┐
│  Azure API (production GR)  │
│  …/api/account/*            │
│  …/api/referrals/*          │
│  …/api/stripe/*             │
└─────────────────────────────┘
```

**Base URL** (from live `web/app/js/api.js`):

```
https://jellinprd-gr-baffgfaegxhrbqfr.westeurope-01.azurewebsites.net/api
```

Port `api.js` unchanged unless the backend URL changes. Do not hardcode a second client on the marketing page.

---

## 3. Business flow — “Start free”

### User journey

```
Marketing “Start free”
  → /app/ (#login)
  → user picks Register
  → POST /account/register
  → #confirm-email (activation key)
  → POST /account/confirmEmail
  → #login → POST /account/login
  → store jellin_token + jellin_refreshToken
  → #dashboard
  → optional #subscription → Stripe
```

### Auth storage (business) — do not rename

| Key | Purpose |
|-----|---------|
| `jellin_token` | Access JWT |
| `jellin_refreshToken` | Refresh |
| `jellin_user` | Cached user/tenant info |
| `jellin_returnTo` | Post-login redirect (sessionStorage) |
| `jellin_registeredEmail` | Confirm-email helper (sessionStorage) |

Module: `Auth` in `app/js/auth.js`.

### API surface (business)

| Action | Method | Path | Auth |
|--------|--------|------|------|
| Register | POST | `/account/register` | anonymous |
| Login | POST | `/account/login` | anonymous |
| Confirm email | POST | `/account/confirmEmail` | anonymous |
| Resend confirmation | POST | `/account/resendConfirmationEmail` | anonymous |
| Request password reset | POST | `/account/requestPasswordReset` | anonymous |
| Reset password | POST | `/account/resetPassword` | anonymous |
| Logout | POST | `/account/logout` | Bearer |
| Update email | PUT | `/account/updateEmail` | Bearer |
| Update password | PUT | `/account/updatePassword` | Bearer |
| Delete account | DELETE | `/account` | Bearer |
| Connection info | GET | `/account/connectionInfo` | Bearer |
| Refresh | (via api.js) | refresh endpoint used by client | refresh token |

Register body (keep fields):

```json
{
  "tenantName": "...",
  "countryCode": "GR",
  "vat": null,
  "email": "...",
  "password": "...",
  "referralCode": null
}
```

`referralCode` ties a new business to a partner — keep optional field on `#register`.

### Stripe (after Start free → logged in)

| Action | Method | Path |
|--------|--------|------|
| List products | GET | `/stripe/products` |
| Create checkout | POST | `/stripe/subscriptions` |
| Upgrade | PUT | `/stripe/subscriptions` |
| Cancel | DELETE | `/stripe/subscriptions` |

View: `subscription.js`. Must ship with the app folder.

### App views to port (business)

- `login.js`, `register.js`, `forgot-password.js`, `confirm-email.js`
- `dashboard.js`, `subscription.js`, `profile.js`
- `components/navbar.js`, `components/toast.js`

---

## 4. Referral flow — “Become a partner”

### User journey

```
Marketing “Become a partner”
  → /app/#referral-login
  → Register link → #referral-register
  → POST /referrals/account/register
  → #referral-confirm-email
  → POST /referrals/account/confirmEmail
  → #referral-login → POST /referrals/account/login
  → store jellin_referral_token + jellin_referral_refreshToken
  → #referral-dashboard
  → GET /referrals/tenants, /referrals/myProfile
```

### Auth storage (referral) — separate from business

| Key | Purpose |
|-----|---------|
| `jellin_referral_token` | Access JWT |
| `jellin_referral_refreshToken` | Refresh |
| `jellin_referral_user` | Cached profile |
| `jellin_referral_registeredEmail` | Confirm helper |

Module: `ReferralAuth` in `app/js/auth.js`.  
Router: routes with `type: 'referral'` in `app.js` use `ReferralAuth`, not `Auth`.

### API surface (referral)

| Action | Method | Path | Token |
|--------|--------|------|-------|
| Register | POST | `/referrals/account/register` | anonymous |
| Login | POST | `/referrals/account/login` | anonymous |
| Confirm email | POST | `/referrals/account/confirmEmail` | anonymous |
| Resend confirmation | POST | `/referrals/account/resendConfirmationEmail` | anonymous |
| Request password reset | POST | `/referrals/account/requestPasswordReset` | anonymous |
| Reset password | POST | `/referrals/account/resetPassword` | anonymous |
| Update base data | PUT | `/referrals/account/updateBaseData` | referral Bearer |
| Update email | PUT | `/referrals/account/updateEmail` | referral Bearer |
| Update password | PUT | `/referrals/account/updatePassword` | referral Bearer |
| Delete account | DELETE | `/referrals/account` | referral Bearer |
| My profile | GET | `/referrals/myProfile` | referral Bearer |
| Tenants | GET | `/referrals/tenants` | referral Bearer |
| Logout | POST | `/account/logout` | referral Bearer + referral refresh |

Register body:

```json
{
  "code": "unique-referral-code",
  "firstName": "...",
  "lastName": "...",
  "email": "...",
  "password": "..."
}
```

API calls that need the referral JWT must pass `useReferralToken = true` (already handled inside `API.Referral.*`).

### App views to port (referral)

- `referral-login.js`, `referral-register.js`, `referral-forgot-password.js`
- `referral-confirm-email.js`, `referral-dashboard.js`, `referral-profile.js`

---

## 5. Router contract (`app.js`)

Must keep:

```js
routes: {
  login, register, 'forgot-password', dashboard, subscription, profile, 'confirm-email',
  'referral-login', 'referral-register', 'referral-forgot-password',
  'referral-dashboard', 'referral-profile', 'referral-confirm-email',
}
```

Behavior to preserve:

- `auth: true` → redirect to login / referral-login if missing token
- Authenticated users hitting auth pages → dashboard / referral-dashboard
- `sessionStorage.jellin_returnTo` for deep-link return
- Fallback unknown hash → `#login`

---

## 6. Marketing-only backend-ish: contact / demo

**Not** the Azure API. Keep Formspree (or equivalent) on the marketing page:

- Endpoint: `https://formspree.io/f/xdalrjdj` (current)
- Fields: `email`, optional `message`, `metadata`
- Trigger: `#contact` / “Get a demo” button → modal

Do not confuse with account registration.

---

## 7. Port checklist for `site-2026/app/`

Copy from `web/app/` (phase 1 = verbatim):

- [ ] `index.html` (script load order)
- [ ] `css/app.css`
- [ ] `js/api.js` — **BASE_URL + Account + Stripe + Referral**
- [ ] `js/auth.js` — **Auth + ReferralAuth**
- [ ] `js/app.js` — full route table
- [ ] All views listed above
- [ ] `js/components/toast.js`, `navbar.js`

Then:

- [ ] Update asset paths (`../assets/...`) if folder depth changes
- [ ] Point marketing CTAs at `app/index.html` and `app/index.html#referral-login`
- [ ] Smoke-test register/login both tracks against production (or staging if available)
- [ ] Smoke-test Stripe product list when logged in as business
- [ ] Smoke-test referral tenants list when logged in as partner

---

## 8. What not to do

- Do not rebuild login as a marketing page form that posts to Azure (CORS, tokens, confirm-email UX all belong in the SPA).
- Do not share one localStorage token key between business and referral.
- Do not remove `referralCode` from business register (partner attribution).
- Do not change hash route names without redirects (bookmarks / emails may use them).
- Do not point “Start free” at Formspree or “Become a partner” at a mailto.

---

## 9. Verification script (manual QA)

1. Open new marketing home → click **Start free** → land on `#login` → Register → confirm → login → dashboard.
2. Open marketing → **Become a partner** → `#referral-login` → Register → confirm → login → referral-dashboard.
3. Business register with a known referral code → confirm partner sees tenant (if applicable).
4. Business → Subscription → products load.
5. Marketing → Get a demo → Formspree success.
6. `/legal/privacy.html` and delete-account still open.

If any of 1–2 fail, the site is **not** shippable regardless of how good the marketing visuals look.
