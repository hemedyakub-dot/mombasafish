# MombasaFish — V1 Audit & V2 Roadmap

*Prepared 4 August 2026 · Honest assessment, not a sales document*

---

## 0. The one disagreement, stated up front

The brief asks for a React + TypeScript + Next.js rebuild, a customer dashboard, checkout,
loyalty programme, AI support agent, multi-language, and international shipping.

**My recommendation: do not build most of that yet, and do not rewrite the stack at all.**

Here is the reasoning, and it's the same reasoning that shaped V1:

| Fact | Consequence |
|---|---|
| 20 orders to date, ~KES 1,000 gross each | The constraint is **demand**, not software |
| Customers are on metered mobile data across 8 counties | Page weight is a **direct business cost** |
| You maintain everything solo, no developer | Every dependency is a future blocker |
| Every order so far came via WhatsApp + M-Pesa | A checkout would be a **worse** funnel, not better |

A Next.js rewrite would add a build step, a node_modules tree, a framework version treadmill,
and roughly 90–200 KB of JavaScript before a single fish appears — to reproduce a site that
currently ships ~8 KB of JS and renders in under a second on 3G. It would make you *dependent
on a developer to change a price*. That is a strategic downgrade disguised as an upgrade.

**Revisit the framework question when any of these are true:** you're doing 300+ orders/month,
you've hired or contracted a developer, or you need per-user accounts with real login. Until
then, vanilla HTML/CSS/JS on Netlify is not a compromise — it is the correct architecture for
this business, and I'd defend that in front of any CTO.

What follows takes the brief seriously everywhere else.

---

## PHASE 1 — Audit

Scores are out of 10, judged against **premium food/DTC sites** (Sitka, Fishwife, Notion-tier
craft), not against typical Kenyan SME sites. Judged as of the current deployed build.

### Scorecard

| Dimension | Score | Note |
|---|---:|---|
| Visual design | **8.5** | Strong, coherent, genuinely premium. Photography now authentic. |
| Branding | **8.0** | Distinct voice, Swahili-first, real wordmark. Logo asset is weak (see below). |
| User experience | **8.0** | Cart→WhatsApp is excellent. FishBox builder is a standout. |
| Information architecture | **6.5** | 7 nav items and growing. Ecosystem/About overlap. |
| Navigation | **6.0** | No mobile menu — nav wraps and eats vertical space on small screens. |
| Mobile experience | **7.5** | Good, but hero heights and nav wrap cost real estate. |
| Desktop experience | **8.0** | Solid. Some sections could use wider max-width. |
| Accessibility | **5.0** | **Weakest area.** Emoji-as-icon, contrast, focus states, no skip link. |
| Performance | **7.5** | Fast JS; images are the drag. No preloading of LCP image. |
| SEO | **4.5** | **Second weakest.** No sitemap, robots, structured data, or canonical tags. |
| Content quality | **9.0** | Genuinely excellent. Fish Guide + Ecosystem are moat-grade. |
| Trust | **7.0** | Strong story; missing policies, reviews, and business registration. |
| Conversion | **7.5** | Clear path to WhatsApp. No urgency/scarcity, no social proof. |
| Technical implementation | **8.0** | Clean, dependency-free, readable. Some duplication across pages. |
| Scalability | **6.0** | Copy-paste HTML across 7 pages will bite at ~15 pages. |
| Security | **6.5** | RLS is correct. **One real finding — see below.** |

**Composite: 7.1 / 10.** That is a genuinely good small-business site. It is not yet a 9.8.

---

### 1.1 Strengths (protect these — do not "improve" them away)

1. **The WhatsApp-first funnel.** Cart → pre-written message → M-Pesa. This matches how the
   business actually works. Most agencies would replace it with a checkout and halve conversion.
2. **The FishBox builder.** Weight-aware cooler recommendation with an opt-out. This solves a
   real logistics problem and no competitor in the region has it.
3. **Know Your Fish.** The quiz + flavour meters are a genuine content moat and the seed of
   MombasaFish Academy. This is the single most defensible asset on the site.
4. **The Ecosystem page.** Honest "today vs going" split. This is investor/partner-grade.
5. **Load discipline.** Sub-second on mobile data. Protect this above all aesthetic ambition.
6. **Swahili-first naming.** Culture as brand, not decoration. Rare and valuable.
7. **Traceability narrative** backed by an actual order tracker — claim and proof in one place.

### 1.2 Critical issues (fix before any new feature)

**C1 — Order-code brute force (security).**
`track_order(order, code)` has no rate limiting. An attacker can iterate codes against a known
order number and read customer name, destination and rider phone. RLS prevents table access but
not RPC abuse.
→ *Fix:* Supabase Edge Function wrapper with per-IP rate limit (e.g. 10 attempts / 10 min), or
a `pg_sleep`-based throttle plus attempt logging. **Do this before the domain launch.**

**C2 — No legal pages.** Kenya's Data Protection Act 2019 applies: you collect names, phone
numbers and delivery addresses. The old Shopify store had privacy/refund policies; the new site
has none.
→ *Fix:* Privacy policy, terms, refund/quality-guarantee page. Two hours of work, removes real
legal exposure and raises trust score.

**C3 — Zero SEO infrastructure.** No `sitemap.xml`, no `robots.txt`, no JSON-LD, no canonicals.
Google currently has almost nothing to work with, and the old store outranks you for your own
brand.
→ *Fix:* Phase 8 below. Highest ROI work on this list.

**C4 — No analytics.** You cannot see which pages convert, where people drop, or whether the
Fish Guide works. You are optimising blind.
→ *Fix:* Plausible or Umami (privacy-friendly, ~1 KB, no cookie banner needed). Not GA4 — it's
heavy, needs consent UI, and you don't need its complexity.

**C5 — Repo hygiene.** `compress.html` and `image-extractor.html` are internal tools sitting on
a public site. Remove them from the repo.

### 1.3 Weaknesses (real, fixable)

- **Accessibility (score 5.0).** Search icon and FishBox use emoji as functional icons — screen
  readers announce "magnifying glass tilted left". No visible focus rings on custom buttons. No
  skip-to-content link. Cart panel is not a focus-trapped dialog. `.pr` price text on `.ds` grey
  fails AA in places. Quantity steppers have no `aria-live` announcement.
- **No mobile menu.** Seven nav items wrap to two lines on a 360px phone.
- **Cart doesn't persist.** Refresh = lost cart. `localStorage` would fix it in ~10 lines.
- **Promo popup fires on `track.html`.** Someone anxiously tracking fish gets an ad. Exclude it.
- **No social proof.** You have 20 real customers and zero testimonials on the site.
- **HTML duplication.** Header/footer copy-pasted 7×. Every nav change is a 7-file edit.
- **Images still the LCP bottleneck.** Hero images aren't preloaded; no `width`/`height` attrs
  (causes layout shift); no WebP/AVIF variants.
- **Ecosystem vs About overlap.** Two pages telling adjacent stories; users won't read both.

### 1.4 Missed opportunities

- **Species pages.** 30+ products with unique Swahili names and zero individual URLs. This is
  the single biggest untapped SEO asset — "jodari price kenya", "how to cook pweza".
- **Recipes as a content pillar** exist in the blog but aren't structured or schema-marked.
- **Google Business Profile** — you have a Maps pin but likely no optimised GBP listing. For a
  physical Mombasa shop this outranks any website work for local intent.
- **The 20-customer list.** Your most valuable asset, currently unused for repeat marketing.
- **Weekly catch update.** You already send these on WhatsApp — they're not on the site.

### 1.5 Quick wins (< 1 day each, high impact)

1. `robots.txt` + `sitemap.xml` + canonical tags
2. JSON-LD: `LocalBusiness`, `Product`, `FAQPage`
3. Analytics (Plausible)
4. Cart persistence via localStorage
5. Suppress promo popup on the tracker page
6. Add `width`/`height` to all images (kills layout shift → Core Web Vitals)
7. Preload the hero image on each page
8. Testimonials section (3–4 real quotes from WhatsApp, with permission)
9. Skip link + focus rings + `aria-label` on icon buttons
10. Remove internal tools from the repo

---

## PHASE 2 — V2 Roadmap

### Stays untouched
WhatsApp cart flow · FishBox builder · Fish Guide quiz · order tracker · Swahili-first naming ·
design language (abyss/foam/catch/coral, Archivo Black + Inter) · vanilla stack · Netlify+GitHub.

### Improves
| Item | Change | Why | Impact |
|---|---|---|---|
| Navigation | Mobile hamburger; group nav into Shop / Learn / About | 7 items won't scale to 12 | Medium |
| Accessibility | Full WCAG 2.1 AA pass | Legal + 15% of users + SEO signal | High |
| Images | WebP + responsive `srcset` + dimensions | LCP is the main perf gap | High |
| Header/footer | Build-time include via a tiny Node script, or Netlify snippet injection | Removes 7× duplication | Medium |
| About + Ecosystem | Merge into one "Our Story" with Ecosystem as an anchor section | Reduces overlap | Medium |
| Cart | Persist to localStorage; add cart badge in header | Recovers abandoned carts | High |

### Moves
- Ecosystem pillars → become the top level of a future `/impact` section
- Blog recipes → dedicated `/recipes` with schema (see SEO)

### Deleted
- `compress.html`, `image-extractor.html` (internal tools)
- Unused images (`jongoo*`, `sardines-alt`, duplicate `sulisuli-kipanga-2`)

### Added (in priority order — see stage gates below)
1. SEO infrastructure + species pages
2. Legal pages
3. Testimonials / social proof
4. Weekly "Today's Catch" strip (manually updated, one line of JSON)
5. Recipes section with schema
6. Fisherman profiles (traceability with a face)
7. Wholesale/restaurant enquiry page (not a portal — a form)
8. Newsletter capture (email list = the asset you don't own on WhatsApp)

### Stage gates — build only when the trigger fires

| Feature | Trigger | Why wait |
|---|---|---|
| Customer accounts / dashboard | 100+ repeat customers | Nobody logs in to buy 2 kg of fish |
| Card checkout | Customers ask for it twice unprompted | WhatsApp converts better today |
| Loyalty programme | 50+ repeat buyers | Needs a base to reward |
| AI support agent | 20+ repeat questions/week | WhatsApp + FAQ handles this now |
| Multi-language (full sw/en) | Analytics shows Swahili demand | Currently bilingual by design |
| International shipping | Export licence in hand | Regulatory, not technical |
| Restaurant/wholesale portal | 5+ B2B accounts | A form and a phone call scale to 20 |
| React/Next migration | 300+ orders/month **or** a developer joins | See section 0 |

---

## PHASE 3 — UX Priorities

**Homepage.** Add above the fold: a live "Today's catch" line and a trust bar with real numbers
(counties served, years trading). Add testimonials after Customer Favorites. Keep the hero.

**Shop.** Add sticky category jump-links; add "cleaned how?" as a cart-level choice (whole /
gutted / filleted / steaks) — currently a free-text hope in the WhatsApp message. This is the
highest-value UX addition on the site: it removes a round-trip from every single order.

**Species pages** (`/fish/jodari`): photo, Swahili + English + scientific name, flavour meters,
cooking methods, price, related recipes, add-to-cart. One template, 30 data rows.

**Tracker.** Add estimated delivery window and a map pin for dispatch. Suppress promo.

**Checkout (WhatsApp).** Add a delivery-county selector before send, so the message carries the
destination — removes another round-trip.

---

## PHASE 4 — Design System

Formalise what already exists into tokens (`--space-1..8`, `--radius-sm/md/lg`, type scale
1.250 major third, `--dur-fast/base/slow`). Document card/button/form variants in a single
`/styleguide.html` page so future work stays consistent. Motion principle: **movement only where
it explains something** (waves = ocean, meters = flavour, FishBox bar = capacity). No decorative
animation — it costs battery on the phones your customers use.

---

## PHASE 5 — Technical

**Recommended stack for V2: the current one, hardened.**

- Keep vanilla HTML/CSS/JS, no build step
- Add a 30-line Node script for header/footer includes (run locally, commit output) — removes
  duplication *without* introducing a framework
- Netlify: enable asset optimisation, add `_headers` (CSP, HSTS, X-Frame-Options) and
  `_redirects`
- Supabase: keep. Add Edge Function for rate-limited tracking (C1)
- Images: convert to WebP, generate 2 sizes, use `srcset`
- Analytics: Plausible
- Testing: Lighthouse CI on Netlify deploy previews (free)
- Backup: monthly export of `mfm_orders` to CSV

**If you ever do migrate:** Astro, not Next.js — it ships zero JS by default, supports plain
HTML, and would let you move page-by-page without a rewrite. That's the honest "future stack"
answer for a content-heavy commerce site with a solo maintainer.

---

## PHASE 6 — Business Features, honestly ranked

**Build now (real ROI at current scale):**
- Cleaning preference in cart · delivery county selector · today's-catch line · testimonials ·
  newsletter capture · wholesale enquiry form

**Build at 100+ orders:**
- Fisherman profiles · live inventory (simple in/out flags) · dynamic delivery estimates ·
  loyalty (a WhatsApp-based punch card beats software)

**Build much later, if ever:**
- Cold-chain IoT tracking · AI recommendation engine · conservation dashboard · customer
  dashboard · card checkout

**Note on "AI seafood recommendation":** the Fish Guide quiz already does this deterministically,
loads instantly, costs nothing, and never hallucinates. An LLM here would be slower, costlier
and worse. Keep the quiz.

---

## PHASE 7 — Performance

Current estimate: ~85–90 Performance, ~75 Accessibility, ~70 SEO.
Path to 100/100/100/100:

1. WebP + `srcset` + explicit dimensions (biggest single win)
2. `<link rel="preload">` the hero image per page
3. Inline critical CSS, defer the rest
4. Self-host the three fonts (removes two third-party connections + FOUT)
5. `font-display: swap` (already implicit via Google, keep on self-host)
6. Full a11y pass → Accessibility 100
7. Meta/canonical/schema → SEO 100
8. `_headers` with CSP → Best Practices 100

All achievable without a framework. Verify with Lighthouse CI on every deploy.

---

## PHASE 8 — SEO Strategy

**Architecture**
```
/                     brand + conversion
/shop                 category hub
  /fish/{species}      30+ pages ← the engine
/recipes/{recipe}     recipe schema
/learn                fish guide + ocean education (Academy seed)
/impact               ecosystem, sustainability, traceability
/blog/{post}          stories
/about /contact /faq /policies
```

**Priority keywords (low competition, real intent, Kenya):**
`jodari price kenya` · `where to buy fresh fish nairobi` · `pweza recipe` ·
`samaki wa kupaka` · `fish delivery mombasa` · `sea moss kenya` · `mangrove honey kenya`

**Schema:** `LocalBusiness` + `Organization` sitewide; `Product` + `AggregateRating` on species;
`Recipe` on recipes; `FAQPage` on home; `Article` on blog; `BreadcrumbList` throughout.

**E-E-A-T:** you have the rarest asset — *first-hand experience*. Put a named author byline on
every post, add a founder bio with photo, cite FAO/KMFRI where you make claims, and show the
physical shop (Google Maps, photos, opening hours).

**Local SEO — do this first, it beats everything above:** claim and fully optimise the Google
Business Profile, post weekly catch photos to it, and ask every satisfied customer for a review.
For a Mombasa fish shop, GBP outranks the entire website strategy for local intent.

**International:** defer until export licensing exists. Then `hreflang` + a `/en-ke` `/en`
split.

---

## PHASE 9 — Five-Year Vision

**Year 1 — Own your foundation.** Domain secured, SEO live, species pages ranking, email list
built, 100+ orders/month, Google Business Profile dominant locally.

**Year 2 — Become the reference.** Fish encyclopedia complete (all Indian Ocean species),
recipes library, fisherman profiles live. Ranking for informational queries across East Africa.
MombasaFish Media producing short documentary content.

**Year 3 — Platform.** Wholesale/restaurant accounts, live inventory, delivery estimates.
MombasaFish Academy launches paid courses. Possible Astro migration if scale demands.

**Year 4 — Ecosystem.** Ocean tourism bookings (dhow trips, Shimoni visits). Conservation
reporting with real mangrove/reef data. Export channel operational.

**Year 5 — Institution.** The default English-language reference for Western Indian Ocean
seafood: species data, prices, seasonality, sustainability. Commerce becomes one revenue line
among media, education, tourism and export.

---

## Self-critique (the part the brief asked for)

**As an Awwwards judge:** the site is handsome but conventional — it would not win. Awwwards
rewards inventive interaction and art direction. The wave canvas is the only signature moment.
*But*: chasing an Awwwards aesthetic would add weight and hurt a business whose customers are on
metered data. **I am deliberately not optimising for that award**, and you should know that's a
choice, not a failure. If you want award-grade, the honest route is a separate, heavy "brand
experience" microsite — not the commerce site.

**As a Google UX reviewer:** accessibility is the blocker. 5.0 is not acceptable. Emoji icons,
missing focus states, and no mobile menu would fail review. Must-fix, not nice-to-have.

**As a senior architect:** the 7× duplicated header/footer is the real debt. It's cheap now,
expensive at 40 pages. Fix with a build script, not a framework.

**As an enterprise CTO:** single point of failure is *you*. No documented runbook, no backup
schedule, no second maintainer. The unrated risk here isn't technical — it's that the Usama
domain situation is unresolved and everything sits on a netlify.app subdomain you don't own the
brand address for. **Securing mombasafish.com is the highest-priority item in this entire
document.**

**Realistic score after the V2 work above is complete: 9.0–9.2.** Not 9.8. Getting to 9.8 would
require professional food photography, a dedicated developer, and original interaction design —
i.e. a budget that doesn't exist yet and shouldn't, at 20 orders. Claiming otherwise would be
flattery, not consulting.

---

## What I'd do in the next 30 days, in order

1. **Buy mombasafish.com + .co.ke** (~KES 2,400) — everything else depends on it
2. Fix C1 (tracker rate limiting) — security
3. SEO infrastructure: robots, sitemap, canonicals, JSON-LD
4. Google Business Profile: claim, optimise, weekly posts, collect reviews
5. Accessibility pass to AA
6. WebP + dimensions + preload → Lighthouse 95+
7. Legal pages
8. Cart persistence + cleaning preference + county selector
9. Testimonials from your 20 customers
10. First 5 species pages (Jodari, Nguru, Pweza, Changu, Prawns) as the SEO template

Items 1–4 will do more for revenue than items 5–10 combined. Items 5–10 will do more than any
framework migration ever would.
