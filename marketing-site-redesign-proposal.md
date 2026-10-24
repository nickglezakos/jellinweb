# Jellin Marketing Site — Redesign Proposal (2026)

**Scope:** Structure, visual language, and messaging for [jellinapp.com](https://jellinapp.com/) (`web/index.html`).  
**Keep:** Current color system (purple → pink → amber gradient, cyan/emerald accents, slate neutrals) and core UX patterns (primary/secondary CTAs, contact modal, “Get Started” / referral flows).  
**Change:** Page architecture, spatial rhythm, visual daring, and copy length/tone for a younger, contemporary marketing audience.

---

## 1. Diagnosis (current site)

### What already works
- The **Jellin gradient** is distinctive and on-brand — keep it as the signature.
- **Real-world stories** (coffee, gym, hotel, sports, mall) are the strongest asset; they make the product feel concrete.
- **No-app / phone-or-email** is a clear differentiator; it should lead, not sit mid-page.
- CTA paths (`Get Started Free`, referral, prelaunch contact) are clear and should stay.

### What holds it back for 2026 / younger audiences
| Issue | Effect |
|--------|--------|
| Hero is logo + line + buttons, no product stage | First viewport feels like a splash screen, not a brand film |
| Five long Before/After blocks with dialogue scripts | Feels like a pitch deck; scroll fatigue before value lands |
| Two overlapping feature systems (numbered 1–4 + 6-card grid) | Same ideas twice; “SaaS brochure” energy |
| Dense card stacks, Inter, centered everything | Safe 2022–24 SaaS look; not daring enough |
| Copy is explanatory and long | Young marketers skim; they don’t read employee/customer transcripts |
| Weak hierarchy of audience | Mixes “for marketers,” end-customer moments, and ops features without a spine |

**Guiding principle for the redesign:** *Fewer sections. Bigger spaces. Shorter lines. One idea per screen.*

---

## 2. Design principles (keep colors, raise ambition)

1. **Brand first** — “Jellin” is the hero signal; headlines support it, never outshine it.
2. **One composition per viewport** — not a dashboard of cards; one job, one headline, one short line, one visual.
3. **Full-bleed product / lifestyle** — real app, SMS, or place imagery edge-to-edge; avoid inset media cards in the hero.
4. **Space as a design material** — larger section padding, fewer borders, less stacked white cards; let the gradient and photography do the work.
5. **Motion with purpose** — 2–3 intentional moments (hero reveal, story snap/scroll, CTA pulse), not hover-lift on every card.
6. **Preserve UX** — same CTA destinations, modal contact, referral entry; only the *presentation* changes.

**Typography note (optional, still “your” brand):** Keep Inter for body if you want zero friction, *or* pair the existing palette with one expressive display face for headlines only (e.g. a tight geometric or soft neo-grotesk). Colors stay; type can get slightly more 2026 without a rebrand.

---

## 3. Proposed page structure

Replace the current long scroll with **7 beats** (down from ~8 heavy blocks that overlap).

```
1. Hero          → Brand + promise + CTA + full-bleed product
2. Proof strip   → 3 short claims (no cards)
3. Stories       → 3–4 cinematic use cases (not 5 dialogue novels)
4. How it works  → 3 steps max
5. Product stage → Mobile / SMS / dashboard as one visual chapter
6. Trust         → Privacy + integrations (compact)
7. Close         → FAQ (short) + final CTA / contact
```

Drop or fold: the duplicate “Platform Features” 6-grid, the giant numbered feature essays, and most Before/After dialogue panels.

---

### Beat 1 — Hero (first viewport)

**Layout:** Full-bleed gradient or lifestyle/product photo as the plane. Brand wordmark large and centered or left-anchored. One headline. One supporting sentence. One CTA group.

**Keep UX:**  
- Primary: `Get Started Free`  
- Secondary: `Be a Jellin Referral` (or rename to something shorter: `Partner with us`)

**Proposed copy**

| Element | Current | Proposed |
|---------|---------|----------|
| Brand | Jellin (logo) | Jellin (keep, larger presence) |
| Line | A marketing app that "jells" with your customers | Loyalty that sticks. No app required. |
| Support | *(none)* | Phone or email. Points. Coupons. Done. |

**Visual:** Edge-to-edge phone / SMS / QR moment (existing assets: coupon QR, customer shop, analytics). No floating badges, no stat strip, no inset rounded hero card.

**Space:** Hero height ≈ 100vh on desktop; generous empty air around type.

---

### Beat 2 — Proof strip (one short section)

Three lines only — not icon cards:

1. **Number in. Reward out.**  
2. **Works with or without the app.**  
3. **One system across shops, malls, hotels.**

Horizontal on desktop, stacked on mobile. Large type, lots of margin, thin gradient underline or vertical rule — no bordered feature cards.

---

### Beat 3 — Stories (the emotional core)

Keep **3 or 4** of the five scenarios. Cut one (recommend dropping the weakest for your go-to-market; often mall *or* sports if hotel + coffee + gym already cover “local + chain”).

**Format change:** From dual-column Before/After + transcript → **editorial full-width story panels**.

Per story:
- Full-bleed or near-bleed photo (use existing before/after imagery — prefer the “after” as the hero frame).
- Industry label (Coffee / Gym / Hotel…).
- **One bold headline** (keep the punchy ones you already have).
- **One sentence** of outcome.
- Optional: a single chat bubble or SMS mock (not a 4-turn script).

**Copy examples (simplify)**

| Story | Keep headline | Body → one line |
|-------|---------------|-----------------|
| Coffee | One coffee becomes a habit. | Their number is the stamp card. |
| Gym | Train anywhere. Earn everywhere. | One membership. Every location counts. |
| Hotel | Check-ins unlock the neighborhood. | One number. Partner perks across the block. |
| Sports | Gear up. Show up free. | Buy the jacket. Get the ticket. |
| Mall | Shop anywhere. One rewards count. | Every store feeds the same wallet. |

**Kill:** Long “Sarah visits…”, employee dialogue blocks, and dual grayscale/color columns as the default. Use a subtle before→after *swipe* or *scroll-linked crossfade* if you want the contrast without the text wall.

**Space:** Each story ≈ one viewport on desktop; clear break between stories (not nested inside tinted rounded mega-cards).

---

### Beat 4 — How it works (replace feature essays)

Three steps, huge numerals, almost no paragraph:

1. **Capture** — Phone or email. That’s the join.  
2. **Reward** — Points, coupons, bonuses — same campaign.  
3. **Connect** — One shop or a whole network.

Optional micro-labels under each: App · QR · SMS · Email — as a single row of text, not a 2×2 icon grid inside a card.

**Section title:** `Built for speed`  
**Not:** “Now, your marketing connects everyone” + four essay cards.

---

### Beat 5 — Product stage (merge “mobile seamless” + proof)

One dark (or gradient) chapter — you already have a strong slate/purple band; keep that energy.

- Title: `Looks good in their hand.`  
- Support: `SMS, email, or full app — same rewards.`  
- Visual: Horizontal scroll or staggered full-height phone frames (reuse existing screenshots). Treat screenshots as the composition, not as small cards floating in a grid.

Fix typos while touching this (`dahsboard` → `dashboard`, `betwen` → `between`).

---

### Beat 6 — Trust (compact)

Merge privacy + integrations into one quiet band:

- Left: **Privacy by design** — Only phone / email. GDPR-ready.  
- Right: **Plugs into your stack** — POS · CRM · ERP · Automation + link to contact.

Keep the gradient CTA pill for “Contact us for integration details” — same UX, smaller footprint.

Fold the six platform feature cards into this beat as **six short phrases** (or drop half):

- Dual coupons · Cross-business redeem · White-label networks · Frictionless join · Live analytics · Privacy first

No second headline repeating the hero tagline.

---

### Beat 7 — Close (FAQ + CTA)

**FAQ:** Keep 4 questions max; answers ≤ 2 short sentences.

Proposed set:
1. Do customers need the app? → No. Phone or email is enough.  
2. Can partners share rewards? → Yes. Earn at A, redeem at B.  
3. Does it work across locations? → Yes. One program, many stores.  
4. How do I see results? → Live redemptions and visits in the dashboard.

**Final CTA:** Keep prelaunch contact modal UX.  
Copy: `Want a demo?` / Button: `Talk to us` (retire the long “ETA: May 2026…” from the button label; put ETA as a small line under the button if still needed).

**Footer:** Slim down placeholder Product/Company/Resources links or wire them to real anchors (`#stories`, `#how`, `#faq`, legal). Dead `#` links feel unfinished to a young audience.

---

## 4. Visual system updates (same palette)

### Keep
- `jell-gradient`: `#a855f7 → #ec4899 → #f59e0b`
- Accents: cyan `#06b6d4`, emerald `#10b981`, pink, amber
- Slate text on light grounds; white on gradient
- Rounded primary buttons (pill CTAs are part of your UX — keep)

### Push further
| Element | Direction |
|---------|-----------|
| **Layout** | Break the `max-w-6xl` cage on hero + stories; go edge-to-edge, then constrain type |
| **Cards** | Default off. Use cards only for FAQ disclosure and the contact modal |
| **Borders / shadows** | Soften or remove `border-2` + heavy shadows; prefer color fields and photography |
| **Section rhythm** | Alternate full-bleed media / quiet type / dark product — not five similar pastel rounded boxes |
| **Imagery** | Prefer after-states and in-hand product; crop tighter, more cinematic |
| **Motion** | (1) Hero logo/type fade-up, (2) story panel parallax or snap, (3) soft gradient shift on final CTA |
| **Nav** | Add a minimal sticky top bar: logo · Stories · How · Contact — translucent over hero |

### Avoid (so it doesn’t feel like generic AI SaaS)
- Another purple feature-card grid
- Stat strips and floating badges on the hero
- Long centered paragraphs under every H2
- Repeating the same value prop in three sections

---

## 5. Messaging map (simple & to the point)

### Voice
- Short sentences. Present tense. Concrete nouns (number, coupon, ticket, coffee).
- No “powerful,” “seamless,” “effortlessly,” “maximize,” “comprehensive.”
- Keep the wordplay **jell** sparingly (once in hero or footer), not in every H2.

### Headline bank (proposed)

| Place | Line |
|-------|------|
| Hero | Loyalty that sticks. No app required. |
| Proof | Number in. Reward out. |
| Stories intro | See it in the wild. |
| How | Three moves. That’s the product. |
| Product | In their pocket. On your dashboard. |
| Trust | Private by default. Connected if you need it. |
| Close | Ready when you are. |

### CTA labels
| Current | Proposed |
|---------|----------|
| Get Started Free | Start free |
| Be a Jellin Referral | Become a partner |
| ETA: May 2026. Contact us for a prelaunch demo | Get a demo |
| Contact us for integration details | Ask about integrations |
| Ready to amplify your marketing campaigns? | Let’s jell. |

---

## 6. Information architecture (what to cut vs keep)

| Current block | Decision |
|---------------|----------|
| Hero | **Rebuild** — add full-bleed visual, shorten copy |
| Gifts grow revenue (5 scenarios) | **Keep 3–4**, redesign as cinematic panels; cut dialogues |
| Mobile seamless experience | **Keep**, merge into Product stage |
| Numbered features 1–4 | **Replace** with 3-step How it works |
| Platform features 6-grid | **Fold** into Trust as short phrases or cut |
| FAQ (6 long answers) | **Keep 4**, shorten answers |
| Integrations banner | **Keep**, compact |
| Footer + contact modal | **Keep UX**, tighten copy + real links |

---

## 7. Suggested scroll storyboard (desktop)

1. **0–100vh** — Gradient/photo plane, Jellin, one line, two CTAs.  
2. **Snap** — Three proof lines, lots of white (or soft slate) space.  
3. **Story A** — Coffee, full-bleed, one sentence.  
4. **Story B** — Hotel or gym.  
5. **Story C** — Sports or mall.  
6. **How** — Giant 1 / 2 / 3.  
7. **Product** — Dark band, phones scrolling sideways.  
8. **Trust + FAQ + CTA** — Quiet close, then contact.

Mobile: same order; stories stack; proof becomes a vertical list; product uses horizontal swipe.

---

## 8. Implementation sketch (when you build)

- Stay on a single `index.html` + Tailwind if preferred; extract critical CSS later.
- Add a thin sticky header; anchor IDs for Stories / How / Contact.
- Reuse existing JPG assets; crop CSS `object-cover` for more daring framing.
- Replace mega-cards with section wrappers + typography; keep modal JS as-is.
- Measure success: scroll depth past hero, CTA clicks, demo form submits — not time-on-page reading dialogues.

---

## 9. Out of scope (for this proposal)

- Rebranding or changing the core gradient palette  
- App / dashboard UX redesign  
- New photography shoot (optional later; current assets can carry v1)  
- Pricing page (can be a follow-on once messaging is locked)

---

## 10. Recommended first build (MVP of this redesign)

1. New hero + sticky nav  
2. Collapse scenarios to 3 cinematic panels + short copy  
3. Replace feature essays with 3-step How  
4. One product screenshot chapter  
5. Short FAQ + tightened final CTA  

That alone will make the site feel more contemporary and youth-facing while keeping the colors and flows you already like.

---

*Proposal based on the published site at jellinapp.com and source `web/index.html` (2026).*
