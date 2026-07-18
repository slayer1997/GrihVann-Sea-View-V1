# sea-views.com — Full-site QA Report (Task 16)

Branch: `seo-implementation`. Run date: 2026-07-18. Tooling run in an isolated Linux sandbox.

## Scope
11 served pages: homepage, `/worli-sea-face-flats/`, 5 locality pages, 2 project pages, 2 report pages. Plus `robots.txt`, `sitemap.xml`, `llms.txt`.

## 1. HTML validation (Nu/vnu via html5validator 0.4.2)
Ran the W3C Nu validator on all served pages.

- **New pages (locality, Worli, reports): zero genuine markup errors.** No unclosed tags, no structural faults.
- Remaining validator messages are **false positives from the bundled vnu 0.4.2**, which predates several now-standard features. All are valid in the current W3C validator:
  - `fetchpriority` on `<img>` — standard WHATWG attribute (already present on `main`'s project pages).
  - CSS `@property`, `oklch()`, `overflow:clip`, `translate`, `backdrop-filter`, `padding-block`, `border-block`, `100svh`, `text-wrap`, `inset` — all on the **untouched homepage** and existing project pages; all valid modern CSS.
- `templates/` and `partials/` contain `{{TOKEN}}` placeholders and are **not served pages**; excluded from validation.

**Action for handoff:** re-run validation against the current online validator (validator.w3.org/nu) on the deployed Cloudflare preview to confirm a clean pass with a modern engine.

## 2. Structured data (schema.org)
Every JSON-LD block parses as valid JSON. Coverage:

| Page | Schema types |
|---|---|
| Homepage | Organization |
| Worli flagship | WebPage (dateModified), FAQPage, BreadcrumbList |
| 5 locality pages | FAQPage, BreadcrumbList |
| Moraj Shivaji Park | RealEstateListing (AggregateOffer, published price), FAQPage, BreadcrumbList |
| Three ICC | RealEstateListing (price omitted — none published), FAQPage, BreadcrumbList |
| 2 report pages | Report (dateModified), BreadcrumbList |

FAQPage answer text was generated from the same source strings as the visible copy and verified to **match exactly** (no `&`/`<`/`>` in answers, so no escaping drift).

**Action for handoff:** confirm each page in Google's Rich Results Test post-deploy (needs a public URL).

## 3. On-page SEO checks
- Every page: exactly **one `<h1>`**, `<meta viewport>` present, **100% image alt-text coverage** (0 missing).
- `<title>` ≤ 60 chars on all pages. Meta descriptions ≤ 160 rendered chars on all new pages (homepage 149). Pre-existing Moraj meta is 164 — left unchanged per the surgical constraint.
- `rel="canonical"` present on all inner pages (added to the two project pages during QA).

## 4. Internal linking
- Link-checker: **0 broken internal links, 0 orphan pages** across all 11 pages.
- Homepage links out to Worli + all 5 localities + both reports (coastline list + footer locality row). Localities cross-link to Worli, sibling localities, and projects. Breadcrumbs on every inner page.

## 5. Performance (static-analysis proxy)
Full Lighthouse needs a headless Chrome + public URL, so it is deferred to the deployed preview. Static indicators all favour a high mobile score:
- Inner-page HTML: 12–16 KB. Shared `site.css` 12 KB (cached across pages), `site.js` 4 KB and **deferred** (non-render-blocking).
- Single render-blocking stylesheet; fonts via `preconnect`; hero images in **WebP** with explicit `width`/`height` (no CLS) and `fetchpriority="high"` on the LCP image.
- No third-party JS, no layout frameworks, no blocking scripts.

**Action for handoff:** run Lighthouse mobile on the Cloudflare preview for homepage + 3 inner pages; expected ≥90 given the above. If the homepage's canvas/GSAP hero drags the score, consider lazy-initialising GSAP after first paint (homepage only — out of scope for this branch).

## 6. Sitemap & robots
- `sitemap.xml`: valid XML, 11 URLs, all resolve.
- `robots.txt`: references the sitemap; explicitly allows answer-engine crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended).

## 7. Data integrity
- No fabricated prices. Published rate cards reused verbatim (Moraj ₹5.19/7.79 Cr; Three ICC configs, price "on enquiry"). All researched figures labelled "indicative market range" with sources in HTML comments and `TODO: Smit verify` markers.
- Price-history / index charts left as **designed empty states** — no researched numbers charted.

## Verdict
Branch is internally consistent and clean on every check runnable offline. The three browser/URL-dependent confirmations (online W3C, Rich Results Test, Lighthouse) are listed in `docs/handoff-for-smit.md` to run against the Cloudflare preview after merge.
