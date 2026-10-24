# Target File Tree — `web/site-2026/`

```
site-2026/
├── README.md
├── docs/
│   ├── SITE-PLAN.md
│   ├── BACKEND-INTEGRATION.md
│   ├── PAGES.md
│   ├── FILE-TREE.md
│   └── BUILD-PHASES.md
│
├── index.html                 # NEW marketing home (7 beats + CTAs)
├── css/
│   └── site.css               # Marketing layout, motion, tokens
├── js/
│   ├── nav.js                 # Sticky nav, smooth scroll
│   ├── contact-modal.js       # Formspree demo modal (from live footer)
│   └── motion.js              # Optional hero / story motion
│
├── pages/                     # Optional secondary marketing
│   ├── partners.html          # (phase 2+)
│   └── stories.html           # (phase 2+)
│
├── app/                       # PORT from ../app — backend SPA
│   ├── index.html
│   ├── css/
│   │   └── app.css
│   └── js/
│       ├── app.js             # Hash router (business + referral)
│       ├── api.js             # Azure client — DO NOT strip
│       ├── auth.js            # Auth + ReferralAuth
│       ├── components/
│       │   ├── navbar.js
│       │   └── toast.js
│       └── views/
│           ├── login.js
│           ├── register.js
│           ├── forgot-password.js
│           ├── confirm-email.js
│           ├── dashboard.js
│           ├── subscription.js
│           ├── profile.js
│           ├── referral-login.js
│           ├── referral-register.js
│           ├── referral-forgot-password.js
│           ├── referral-confirm-email.js
│           ├── referral-dashboard.js
│           └── referral-profile.js
│
├── legal/                     # PORT from ../legal
│   ├── privacy.html
│   ├── terms.html
│   ├── delete-account.html
│   └── legal.css
│
└── assets/                    # Copy or symlink from ../assets
    ├── logos/
    ├── jellin-share-image.png
    ├── jellin-*-after.jpg
    ├── jellin-*-before.jpg
    ├── jellin-analytics-01.jpg
    ├── jellin-email-01.jpg
    ├── jellin_customer_shos_01.jpg
    └── jellin-qr-coupon-01.jpg
```

## Path conventions

From marketing `index.html`:

| Target | Relative href |
|--------|----------------|
| Business app | `app/index.html` |
| Referral login | `app/index.html#referral-login` |
| Privacy | `legal/privacy.html` |
| Image | `assets/...` |

From app views:

| Target | Relative href |
|--------|----------------|
| Marketing home | `../index.html` |
| Logos | `../assets/logos/...` |

## What stays outside this folder until cutover

- Live `web/index.html`, `web/app/`, `web/legal/` continue serving production.
- `web/wrangler.jsonc` — update `pages_build_output_dir` only when ready to publish `site-2026`.
- Business PDFs / NDA HTML / internal docs — not part of the public 2026 marketing site.
