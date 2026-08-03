# Mombasa Fish Market — Site Handover

*6 files, flat structure, no build step. 3 Aug 2026*

## Files

| File | What it is |
|---|---|
| `index.html` | Home — hero, how-to-order, featured catch, freshness story |
| `catalogue.html` | All 34 products, WhatsApp order builder (tap +, send prefilled message) |
| `blog.html` | All 7 blog posts, filterable by pillar |
| `about.html` | Sourcing & traceability story |
| `track.html` | Order tracker — same Supabase `track_order` / `confirm_receipt` RPCs as the team app |
| `style.css` | Shared styles (design tokens from the tracker) |

## Deploy (10 min, free)

1. GitHub → create new repo `mombasafish-site` (or add to an existing one)
2. Upload all 6 files to the repo root
3. Netlify → **Add new site → Import from GitHub** → pick the repo
4. Build command: *none* · Publish directory: `/` → Deploy

✅ Success: site live at `<name>.netlify.app`, catalogue "+" buttons build a WhatsApp message, tracker finds a real order.

When you buy the domain later: Netlify → Domain management → add it. Nothing else changes.

## Decisions baked in (change if wrong)

- **WhatsApp number: 254 787 668 888** — taken from the live tracker. (Shopify billing shows 0784 531 048 — confirm which is the business line. To change: search-replace `254787668888` across the HTML files.)
- Stage labels assumed: 1 Imepokelewa · 2 Inaandaliwa · 3 Imetumwa · 4 Imefika · −1 Imesitishwa. Confirm-receipt button shows at stage 3.
- "Tip" product excluded from catalogue.
- Products without photos (Simusimu, Songoro, Sulisuli Kipanga, Una, Uwono, Mwani ×2, Unga wa Mwani, Asali) show a styled placeholder — swap in `<img>` tags when photos exist.

## Known dependency to fix later

Product photos load from the **old store's Shopify CDN**. If that store ever closes, images break. Before the Usama situation resolves: download all product photos and commit them to the repo (`images/` folder), then update the `src` URLs.
