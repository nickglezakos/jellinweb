# CTA Map (quick reference)

Print this next to the marketing build. Wrong hrefs = broken product.

| UI label | Element | Destination | Backend? |
|----------|---------|-------------|----------|
| Start free | Hero primary, nav button, footer Product | `app/index.html` | Yes → business Auth + `/account/*` |
| Become a partner | Hero secondary, footer Partners | `app/index.html#referral-login` | Yes → ReferralAuth + `/referrals/*` |
| Create partner account | Optional partners page | `app/index.html#referral-register` | Yes |
| Create business account | Optional deep link | `app/index.html#register` | Yes |
| Get a demo | Close section / `#contact` | Contact modal → Formspree | No Azure |
| Ask about integrations | Trust section | `#contact` | No Azure |
| Privacy | Trust / footer | `legal/privacy.html` | No |
| Terms | Footer | `legal/terms.html` | No |
| Delete account | Footer / Play | `legal/delete-account.html` | In-app also uses API delete |

## HTML snippets (copy into marketing)

```html
<!-- Business account funnel -->
<a href="app/index.html" class="btn-primary">Start free</a>

<!-- Referral / partner funnel -->
<a href="app/index.html#referral-login" class="btn-secondary">Become a partner</a>
```

Do not replace these with `<form>` posts to the Azure API from the marketing page.
