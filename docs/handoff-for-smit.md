# Handoff for Smit — sea-views.com SEO branch

Everything below is the manual work that needs a human, credentials, or verified data. The code is done and committed on `seo-implementation`.

---

## 0. One-line merge instruction
Review the `seo-implementation` branch → merge to `main` → Cloudflare Pages auto-deploys → resubmit `sitemap.xml` in Google Search Console. That's it.

---

## 1. Google Search Console + Bing Webmaster (DNS TXT via Cloudflare)
Verify at the **domain** level (covers http/https + all subdomains) using DNS TXT — no file upload, no risk to the deploy.

**Google Search Console**
1. search.google.com/search-console → Add property → **Domain** → enter `sea-views.com`.
2. Google shows a TXT record like `google-site-verification=XXXXXXXX`.
3. Cloudflare dashboard → `sea-views.com` → **DNS** → Add record: Type `TXT`, Name `@`, Content = the full `google-site-verification=…` string, TTL Auto. Save.
4. Back in GSC, click **Verify** (allow a few minutes for DNS).
5. After verifying: **Sitemaps** → submit `https://sea-views.com/sitemap.xml`.

**Bing Webmaster Tools**
1. bing.com/webmasters → Add site `https://sea-views.com`. Fastest path is **Import from GSC**; otherwise use DNS.
2. DNS option: Bing gives a TXT `MS=msXXXXXXXX`. Add it in Cloudflare DNS exactly as in step 3 above (Name `@`).
3. Verify, then submit the same sitemap URL.

---

## 2. Cloudflare AI-crawler setting — recommendation: ALLOW answer-engine bots
Your whole edge is transparency ("every price published"). Answer engines are free distribution for that angle, so **allow** them:
- **GPTBot** (OpenAI), **ClaudeBot** (Anthropic), **PerplexityBot**, **Google-Extended** (Gemini/AI Overviews).

Two places this is set:
1. **robots.txt** — already done on this branch: those four bots are explicitly `Allow: /`.
2. **Cloudflare dashboard** → `sea-views.com` → **Security → Bots** (and **Settings → AI Crawl Control** / "Block AI bots" toggle if present): make sure the **"Block AI Scrapers and Crawlers" managed rule is OFF**, or add an allow exception for the four bots above. If it's on, it overrides robots.txt and starves you of AI-answer visibility.

(Leave generic malicious-bot protection ON — this is only about answer engines.)

---

## 3. Google Business Profile + footer NAP
**GBP description draft (GrihVann)** — 750 char limit, no links/phone in the text:
> GrihVann is a Mumbai sea-facing property advisory with one rule: every price is published. We curate verified, sea-facing flats and apartments for sale across Worli Sea Face, Bandra, Juhu, Versova, Prabhadevi, Marine Drive and Central Mumbai — and for every home we publish the full rate card, carpet area, charges and a per-floor obstruction report, so you know exactly which floors get an unobstructed sea view before you ask. No "price on request", no hidden brokerage. Book a private viewing at sea-views.com.

Category: *Real estate agency / Real estate consultant*. Service area: Mumbai.

**Footer NAP placeholder** — the homepage Organization schema has `TODO: Smit add NAP`. Once you have the verified office address + phone, add to the `Organization` JSON-LD in `index.html`:
```json
"address": { "@type": "PostalAddress", "streetAddress": "…", "addressLocality": "Mumbai", "addressRegion": "MH", "postalCode": "…", "addressCountry": "IN" },
"telephone": "+91-…"
```
Also swap the placeholder footer phone `+91 22 6000 0000` and the WhatsApp number (see §5) for the real ones.

---

## 4. PR pitch emails — "the brokerage that publishes every price"
Lead with **Report #1 (Worli Sea Face Price Report)**; the **Sea-View Premium Index** is the more original follow-up hook. Send once the reports carry your verified numbers.

**A) ET Realty (Economic Times)**
> Subject: The Mumbai brokerage publishing every sea-face price — Worli data inside
>
> Hi [name],
> Most Mumbai sea-facing listings still say "price on request." We've gone the other way: sea-views.com publishes every rate card, carpet area and a per-floor obstruction report for each home. We've just compiled a Worli Sea Face Price Report — indicative ₹/sq.ft by floor band and BHK, structured around our own verified transactions. Happy to share the data and an interview on why price opacity persists in luxury resi. Worth a look for ET Realty?
> — Smit, GrihVann

**B) Moneycontrol**
> Subject: Data: what a 180° sea view is actually worth in Mumbai
>
> Hi [name],
> We built the Sea-View Premium Index — it isolates one variable no index tracks: the width of the sea-view arc (a full 180° sweep vs a 90° wedge between towers) and what buyers pay for it. It's grounded in per-unit obstruction data we already collect for every listing. There's a clear consumer-protection angle: buyers routinely pay full-arc prices for partial-arc views. Keen to walk your markets desk through the methodology and numbers.
> — Smit, GrihVann

**C) HT Real Estate (Hindustan Times)**
> Subject: "Every price published" — a transparency experiment in Mumbai luxury resi
>
> Hi [name],
> A quick story idea: a Mumbai advisory that publishes the full rate card and a floor-by-floor obstruction report for every sea-facing home it lists — no hidden brokerage, no "price on request." We can back it with a Worli Sea Face price breakdown and real buyer stories about obstructed "sea-view" flats. Happy to give HT first access to the data.
> — Smit, GrihVann

---

## 5. Verified-data punch list — every `TODO: Smit` marker
Grep any time with: `grep -rn "TODO: Smit" --include=*.html .`

**Homepage (`index.html`)**
- Add NAP (address + telephone) to the Organization JSON-LD.
- Swap `logo` in Organization schema to a real brand logo asset (currently reuses an existing image).
- Confirm/remove the **"Meridian Worli"** card, testimonial ("Aditi Rao · Meridian Worli") and form placeholder — treated as unverified placeholder (no project page built for it).

**WhatsApp number (site-wide):** replace the placeholder `wa.me/912200000000` on every project, locality, report and Worli page + `partials/footer.html` + `templates/inner-page-template.html` with the real WhatsApp business number.

**Worli page (`/worli-sea-face-flats/`)**
- Replace indicative ₹/sq.ft with GrihVann transacted data; confirm the on-site ₹84,500 Worli figure.
- Verify floor-band price deltas.
- Verify BHK ticket sizes (currently modelled from indicative ₹/sq.ft × typical carpet).
- Supply the 12-month verified transacted series for the chart (empty-state until then — do NOT chart researched numbers).

**Locality pages (`/bandra/`, `/juhu/`, `/versova/`, `/prabhadevi/`, `/marine-drive/`)**
- Replace indicative ₹/sq.ft with transacted data.
- Add verified project listings for Bandra, Juhu, Versova, Marine Drive (Prabhadevi already references the two real Central-Mumbai projects).

**Reports (`/reports/…`)**
- Worli Price Report: replace indicative ranges with verified figures, then relabel "indicative" → "verified"; fill floor-band premiums.
- Sea-View Premium Index: replace illustrative multipliers with premiums from matched-pair transactions; supply matched-pair data to compute and chart the real index.

---

## 6. Post-deploy verification (needs the live/preview URL)
Run these against the Cloudflare preview after merge (couldn't be done offline):
- **W3C validator** (validator.w3.org/nu) on 3–4 pages — current engine accepts the modern CSS the offline validator flagged.
- **Google Rich Results Test** on each page — confirm Organization, RealEstateListing, FAQPage, BreadcrumbList, Report.
- **Lighthouse mobile** on homepage + 3 inner pages — target ≥90 (inner pages are lightweight; if the homepage GSAP/canvas hero drags it, lazy-init GSAP after first paint — homepage only).
