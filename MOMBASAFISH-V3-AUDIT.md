# MombasaFish — V3 Audit & Roadmap
**Date:** 6 August 2026 · **Auditor:** full-stack review (UX, CRO, SEO, a11y, performance, brand)
**Scope:** all 8 live pages, 43 images, 3 JS modules, 33 KB stylesheet
**Method:** static analysis of the actual repo — every number below is measured, not estimated

---

## 0. The headline finding

You have roughly **68 distinct pieces of content living on 8 URLs.**

| Content | Items | URLs it occupies |
|---|---|---|
| Products | 41 | 1 (`catalogue.html`) |
| Blog articles | 8 | 1 (`blog.html`) |
| Fish species profiles | 19 | 1 (`fishguide.html`) — and 0 of it is indexable |
| **Total** | **68** | **3** |

This single fact explains most of what follows. It is simultaneously the biggest SEO limitation, the biggest conversion limitation, and the biggest engagement limitation on the site — and fixing it fixes all three at once.

**Why it matters for SEO.** Google ranks *pages*, not sections. Nobody searches "MombasaFish catalogue." They search *"changu fish price Mombasa"*, *"how to cook pweza"*, *"where to buy prawns Nairobi delivery"*. Each of those queries needs a page whose entire subject is that one thing. You currently offer Google one page about forty-one things, which competes for none of them.

**Why it matters for conversion.** A product page is where purchase confidence gets built — origin, nutrition, cooking method, shelf life, reviews. You have a card with three lines of text. A restaurant buyer deciding on 20 kg of kingfish has nowhere to go to satisfy themselves.

**Why it matters for engagement.** Pages-per-session is one of your stated goals. With no product or article URLs, a visitor's maximum possible journey is 8 pages, and realistically 3. Add product pages and the ceiling becomes 60+.

**Why it matters commercially, today.** You sell on WhatsApp. Right now you cannot send a customer a link to one fish. You send them to a page with 41 products and hope. A link like `mombasafish.com/fish/changu` — with photo, price, and cooking notes — is a sales tool you use twenty times a day.

---

## 1. UX audit

### Strengths worth protecting
- **The logo-as-menu navigation** is genuinely distinctive and gets the header out of the way. Do not let anyone talk you into a conventional nav bar.
- **The FishBox cooler calculator** is the best thing on the site. It solves a real problem (what size box do I need?) that competitors ignore, and it teaches the customer your logistics constraint without a word of explanation.
- **The hero reduction** — logo, wordmark, blessing — is confident. Most seafood sites open with a wall of offers. Yours opens with restraint, which reads as expensive.
- **Swahili-as-subtitle** throughout is a real moat. No international competitor can copy it credibly.

### Weaknesses

**W1 — The homepage doesn't sell anything.** 792 words, and the visitor must click before seeing a single fish or price. The restraint is beautiful but it defers every commercial signal. A first-time visitor from Google has no idea what you cost, what you carry, or whether you deliver to them.

**W2 — Dead end after the hero.** Two CTAs (Shop, Ecosystem) and then a scroll. There's no third path for the visitor who isn't ready to buy — no recipe, no article, no species. Those visitors leave.

**W3 — The Fish Guide is orphaned.** 19 species with flavour meters and a quiz — and not one of them links to the product you can buy. A visitor learns that tewa is mild and firm, then has to go find it in a 41-item grid. This is the clearest engagement leak on the site.

**W4 — The blog is a wall.** 26 headings, 2,271 words, one scroll. There is no index, no filtering, no reading time, no dates visible in the flow. Nobody reads the eighth article.

**W5 — No path from content to cart.** The blog has an article on cooking nguru. `catalogue.html` sells nguru. Nothing links them. Measured internal linking is **exactly 8 links per page on every page** — which is the navigation, and nothing else. Zero contextual links anywhere on the site.

**W6 — No reviews, anywhere.** You have 20 real customers and zero of their words. For a category built entirely on trust — food, freshness, money up front, delivery from 500 km away — this is the single cheapest missing asset.

---

## 2. Conversion audit

**C1 — Nowhere to build confidence before the cart.** The decision to spend KES 9,500 on a Bwanaharusi box is made on four lines of copy. No reviews, no photos of a delivered order, no cooking guidance, no answer to "what if it arrives bad?"

**C2 — The quality guarantee is buried in policies.html.** Your strongest conversion asset — *not satisfied, we make it right* — sits behind a footer link in an accordion. It should be visible at the moment of add-to-cart.

**C3 — Delivery cost is unknown until WhatsApp.** The visitor in Nakuru cannot find out what transport costs. Unknown cost is the most reliable abandonment trigger in e-commerce. Even a range ("Nairobi typically KES 500–800") removes the fear.

**C4 — The cart has no summary of what happens next.** After "checkout on WhatsApp," what? Who replies? How fast? When do I pay? Naming the sequence removes hesitation.

**C5 — No repeat mechanism.** No email list, no reorder, no "you ordered this last time." Repeat customers are a stated goal with no supporting feature.

**C6 — Restaurants and hotels have no door.** Two of your eight target audiences are B2B, and there is nothing on the site for them: no wholesale pricing, no standing-order enquiry, no invoice mention, no minimum quantities. A hotel procurement officer bounces.

---

## 3. SEO audit

### Measured state

| Check | Result |
|---|---|
| Canonical tags | ✅ 8/8 pages |
| Meta descriptions | ✅ 8/8, all 105–196 chars |
| Open Graph images | ✅ 8/8 |
| Breadcrumb schema | ✅ 7/8 (missing on policies) |
| LocalBusiness + FAQ schema | ✅ index only |
| **Product schema** | ❌ **0 of 41 products** |
| **Article schema** | ❌ **0 of 8 articles** |
| **Recipe schema** | ❌ none |
| Heading hierarchy | ❌ h2→h4 skips on 6 of 8 pages |
| `policies.html` h1 | ❌ page starts at h2 |
| Contextual internal links | ❌ 0 (nav only, 8/page uniform) |
| Fish Guide indexable text | ❌ **219 words for 19 species** — content is trapped in a JS array |

### The three that cost you most

**S1 — No Product schema.** This is why Google shows you a plain blue link while competitors show price, availability and stars. 41 products, zero eligible for rich results. Highest ratio of impact to effort on the entire site.

**S2 — The Fish Guide is invisible.** 19 species profiles rendered from `var FISH=[...]`. Google can execute JavaScript, but it does so on a delayed, lower-priority crawl, and it will not treat client-rendered text with the same weight as server-rendered HTML. You built your most impressive page and hid it. **219 indexable words** is the measurement.

**S3 — Eight articles sharing one URL.** Your kingfish cooking article, your blue economy piece, your SOFIA 2026 coverage — all competing as one page. Each deserves its own URL, its own title tag, its own Article schema. The SOFIA 2026 content in particular is genuinely newsworthy and could earn links, which nothing else on your site can.

### Keyword opportunity, unclaimed
Nobody in Kenya is properly ranking for: `changu fish price`, `samaki wa kupaka recipe`, `pweza recipe`, `fresh prawns delivery Nairobi`, `nguru fish Kenya`, `sea moss Kenya`, `mangrove honey Kenya`. These are low-competition, high-intent, and yours to take — but only with pages that exist.

---

## 4. Accessibility audit

Previous WCAG work holds up well: skip links, focus-visible, `aria-live`, `aria-expanded`, reduced-motion support are all present and correct.

Outstanding:

- **A1 — Heading level skips (WCAG 1.3.1, Level A).** h2→h4 on blog, ecosystem, fishguide, index, policies, track. Screen-reader users navigating by heading lose the structure.
- **A2 — `policies.html` has no h1 (WCAG 1.3.1).** Page begins at h2.
- **A3 — 39 of 64 images on `catalogue.html` lack `width`/`height`.** An accessibility-adjacent issue that is primarily a performance one — see P2.
- **A4 — Colour contrast unverified** on `.bsw` (foam #7FD4C1 on abyss #032A2E) and `.note` at 58% opacity. Needs measurement, likely fails AA on the muted note text.

---

## 5. Performance audit

| Measure | Value | Verdict |
|---|---|---|
| Images | 43 files, 2.92 MB, avg 66 KB | Good |
| Heaviest image | jongoo-crate.jpg, 154 KB | Acceptable |
| CSS | 33 KB, one file, render-blocking | Acceptable |
| JS | 14 KB across 3 files, all deferred | Excellent |
| `catalogue.html` | **56 KB HTML, 64 images on one URL** | Problem |
| Images missing dimensions | **39 of 64 on catalogue** | Problem — causes CLS |

**P1 — The catalogue is one enormous page.** 64 images and 56 KB of HTML. Lazy loading helps below the fold, but the browser still parses 2,413 words and 64 image elements before it can paint. On a 3G connection in Nakuru this is the slowest thing you own. Product pages fix this structurally by splitting the load.

**P2 — 39 images without width/height cause layout shift.** Cumulative Layout Shift is a direct Core Web Vitals ranking factor, and it's also the thing that makes a page feel cheap — content jumping as images arrive. This is a mechanical fix with real ranking value.

**P3 — Google Fonts is render-blocking.** Three families, five weights, loaded from an external origin before first paint. `preconnect` is present, which helps. Self-hosting the two weights actually used would remove a third-party round trip entirely.

**Note on Lighthouse targets.** Your brief asks for Performance >95, Accessibility >98, SEO >98, Best Practices >98. I cannot run Lighthouse from here and will not invent scores. Accessibility >98 and Best Practices >98 are realistic after the fixes above. SEO >98 is realistic. Performance >95 on mobile is achievable for every page *except* the current catalogue, which will need splitting to get there.

---

## 6. Brand & design critique

**What's working.** The palette (abyss/foam/catch/coral) is distinctive and doesn't look like a template. Archivo Black for display is a confident choice. The 1:1 card images fixed the earlier cropping problem. The wordmark treatment reads as a brand rather than a business name.

**B1 — Two visual languages are competing.** Light "Fresh Market" pages (cream, airy) versus dark premium blocks (abyss cards, bands). It currently reads as a system that grew rather than one that was designed. The fix isn't to pick one — it's to make the rule explicit: *dark = curated/premium/editorial, light = browse/transact.* Then apply it consistently.

**B2 — Photography is inconsistent.** Some images are shot on ice at the slab; others are stock. The stock ones are technically better and brand-wise worse. Your real photographs — a hand holding sardines, fish on a crate — are the credibility. A visitor who senses stock photography on a *traceable to the source* site has caught you in a small lie, and small lies are expensive here.

**B3 — Density versus premium on mobile.** 4–5 items across is dense and efficient, and it does undercut the premium positioning slightly. It's the right call for now — but the moment product pages exist, the grid becomes a browse surface rather than the whole shop, and 3-across with better imagery would carry more weight.

---

## 7. What I recommend you do NOT build

Being direct, because these were in the brief and I think they would damage the business.

**❌ Live inventory indicators.** You have no inventory system. The stock is whatever the Shimoni boats landed this morning, known to you and nobody else. Any number displayed would be invented.

**❌ Low-stock urgency ("Only 3 left!").** This is the one I'd actively refuse. It would be fabricated scarcity — a dark pattern — and it directly contradicts the only asset you actually have. Your entire brand is *traceable, honest, from the source.* A customer who realises the counter is fake doesn't just distrust the counter; they start wondering whether the fish really came from Shimoni this morning. You'd be trading your single differentiator for a small short-term lift. Under Kenya's Consumer Protection Act 2012, misleading representations about supply are also unlawful.
> **Honest alternative that works better:** "Today's catch — landed 06 August." Real scarcity, truthfully expressed. Fresh fish is *genuinely* limited and *genuinely* perishable. You don't need to invent urgency when you have the real thing.

**❌ Countdown timers to a fake deadline.** Same objection. A *real* dispatch cutoff ("order before 4pm for tomorrow's Nairobi run") is honest and I'd build it gladly.

**❌ Google Reviews auto-integration.** Requires the Places API and a paid widget for ongoing display. Collect your 20 real customers' words directly and publish them with names. Cheaper, more credible, and you own it.

**⚠️ AI Seafood Assistant — with a caveat.** A true LLM assistant needs a backend, an API key, and a per-message cost you'd pay whether or not the visitor buys. But the questions in your brief — *which fish has fewer bones? which is best for frying? what should children eat?* — are answerable from a fixed decision tree. You already have the data: the Fish Guide's flavour, oiliness and bones ratings. A rules-based recommender runs client-side, costs nothing, works offline, never hallucinates a wrong answer about a food product, and answers 90% of real questions. That's what I'd build. If it proves popular, upgrade it to a real LLM later with usage data to justify the cost.

---

## 8. Prioritised roadmap

Ordered by (impact ÷ effort), not by the order the brief listed them.

### Phase 1 — Structure *(the foundation everything else needs)*
| # | Item | Why first |
|---|---|---|
| 1.1 | **41 product pages** at `/fish/{slug}` | Fixes SEO, CRO and engagement simultaneously. Nothing else compares. |
| 1.2 | **Product schema on each** | Price + availability rich results in Google |
| 1.3 | **Cross-link Fish Guide ↔ products ↔ blog** | Kills W3 and W5; lifts pages-per-session immediately |
| 1.4 | Add `width`/`height` to 39 images | Direct Core Web Vitals gain |
| 1.5 | Fix heading skips + `policies.html` h1 | WCAG Level A conformance |

### Phase 2 — Trust *(what turns visits into orders)*
| # | Item |
|---|---|
| 2.1 | Real customer testimonials, named, with the quality guarantee beside them |
| 2.2 | Delivery cost transparency — a county-by-county indicative table |
| 2.3 | "What happens after you send your order" — the 4-step sequence |
| 2.4 | Guarantee badge at the cart, not buried in policies |

### Phase 3 — Content *(what earns traffic)*
| # | Item |
|---|---|
| 3.1 | Split blog into 8 URLs + Article schema |
| 3.2 | Recipe Box — 8 recipes, own URLs, Recipe schema, linked to products |
| 3.3 | Server-render the Fish Guide (fixes the 219-word problem) |
| 3.4 | Species pages merge with product pages from 1.1 |

### Phase 4 — Depth
| # | Item |
|---|---|
| 4.1 | Rules-based Seafood Assistant (client-side, no API cost) |
| 4.2 | B2B page for restaurants and hotels |
| 4.3 | Email capture into Supabase |
| 4.4 | Honest dispatch cutoff + "landed today" dating |

### Phase 5 — Polish
| # | Item |
|---|---|
| 5.1 | Scroll-reveal animations, reduced-motion safe |
| 5.2 | Self-host fonts |
| 5.3 | Design-language rule enforced (dark = editorial, light = transact) |
| 5.4 | Replace remaining stock photography with your own |

---

## 9. Honest expectations

**On timeline.** This brief describes an agency engagement. Phase 1 alone is a substantial build. Doing all five phases well is weeks, not one sitting. The order above is chosen so that value lands early and each phase stands on its own.

**On SEO.** New pages take 4–12 weeks to rank. Product pages built today start earning in October. This is a reason to start now, not a reason to hesitate.

**On the biggest risk.** It isn't design. It's that 41 product pages need 41 sets of genuine content — real cooking notes, real sourcing detail, real photographs. Generated filler would rank for nothing and would read as hollow to the restaurant buyer you're trying to win. The Fish Guide data and your blog give a strong start for perhaps 19 of them. The remaining 22 need your knowledge.

---

## 10. Recommendation

**Start with Phase 1.1 — product pages.** One decision unlocks the SEO opportunity, the conversion opportunity, the engagement opportunity, and gives you a link to send on WhatsApp twenty times a day. Everything else in this document is easier once those pages exist.
