# sea-views.com — Repo Inventory (Task 1, read-only audit)

_Baseline snapshot of `main` before any SEO edits, captured on the `seo-implementation` branch._

## 1. Files & assets
```
index.html                          homepage — single file, dark theme, GSAP/canvas hero
projects/moraj-shivaji-park.html    project page — cream editorial theme
projects/three-icc.html             project page — cream editorial theme
assets/ hero-1920/2908/960/mobile (webp+jpg), living-room-sea-link-view.png, Sea-views-blog-resize.png
assets/moraj-shivaji-park/ bathroom, deck-sea-link, living-sea-view, skyline-sea-link, tower-render (webp)
assets/three-icc/ bedroom, dadar-skyline, deck-city-view, lobby, pool-night, towers-dusk (webp)
```
No robots.txt, sitemap.xml, llms.txt, JSON-LD, or shared /assets/site.css|js exist on main.

## 2. Two design systems (important)
- Homepage: dark (--ink oklch 13%), Fraunces + Manrope, canvas `#sea` + GSAP ScrollTrigger + scroll-driven @property animations. Nav classes .brand/.nav-links/.nav-cta; inline <footer>.
- Project pages: cream editorial (--cream #FAF7F1), Cormorant Garamond + EB Garamond + IBM Plex Mono, static <img> hero, JS only toggles nav.scrolled. Nav classes .logo/.navlink/.nav-cta; .site-footer/.footer-inner/.rera.

Implication: the homepage CSS/JS is tightly coupled to its GSAP + @property hero and cannot be factored out without risking pixel changes (a hard constraint). The cream project-page template is the established inner-page pattern; all new inner pages match it, and shared site.css/site.js are built from it. Homepage stays intentionally self-contained.

## 3. Homepage current SEO state
- Title: "Sea Views — Curated Sea-Facing Homes in Mumbai | GrihVann" (54 chars)
- Meta: "Curated new-launch sea-facing residences in South & Central Mumbai. Verified inventory, published pricing, zero hidden brokerage. By GrihVann." (140 chars)
- H1: "The horizon, from your living room"
- H2s: "Homes that face the water" | "From Marine Drive, to Madh Island" | "Book a private viewing of the horizon."
- H3s (cards): "Moraj Shivaji Park" | "Three ICC" | "Meridian Worli"
- Schema: none. Keyword "sea facing flats in Mumbai" absent from title/H1/first-100-words (site says "homes/residences", not "flats"). Primary gap.
- Published data to reuse: stats 100% prices published, 9 years, 0 hidden fees, Rs 4200 Cr transacted; coastline counts Marine Drive 02 / Worli 03 / Bandra 02 / Versova & Madh 02.
- Contact tel:+912260000000 (placeholder). No WhatsApp link and no NAP address anywhere. -> TODO: Smit verify WhatsApp number + NAP.

## 4. Real project list (from the live site)
### A. Moraj Shivaji Park — projects/moraj-shivaji-park.html
Shivaji Park, Dadar West. Moraj Group. G+41, 2 residences/floor, 12 ft ceilings.
Published rate card (reuse verbatim): 3 BHK 1,077 sq.ft. = Rs 5.19 Cr+ ; 3 BHK 1,442 sq.ft. = Rs 7.79 Cr+.
Private deck + 300+ sq ft lift lobby, infinity pool, sky lounge. RERA "on request" (no number). Source: brochure Jul 2026.

### B. Three ICC — projects/three-icc.html
Island City Center, Dadar. Bombay Realty (Wadia Group). 3 towers A/B/C, 46–67 floors, freehold.
Published configs (no per-unit price): 3 BHK 1,283 / 3 BHK 1,487 / 4 BHK 2,143 / 4 BHK 2,156 / 4.5 BHK 2,582 / 5 BHK 2,994 sq.ft.
Pricing "Rate card on enquiry" -> Offer schema OMITS price. RERA (published): PR1171012502563, PR1172022600316, PR1172022600317. Source: brochure May 2026.

### C. "Meridian Worli" — homepage card only, NO page, NO assets
Third homepage card (Rs 84,500/sq ft), testimonial cite, and form placeholder. Brief names "Meridian" as an example-name to avoid; no dedicated page/assets exist. Treated as unverified placeholder: NO project page built; left on homepage (surgical constraint) and flagged TODO: Smit confirm whether Meridian Worli is a real listing or placeholder to remove. Flagship Worli page is a locality/keyword page, not this project.

## 5. Locality coverage
Only the homepage "Coastline" list references localities. No dedicated locality pages exist. New: /bandra/, /juhu/, /versova/, /prabhadevi/, /marine-drive/, plus flagship /worli-sea-face-flats/.

## 6. Indicative market pricing (public research — label indicative, TODO verify)
Not published on the site; used only as clearly-labelled "indicative market range" with TODO: Smit verify. Sources in each page's HTML comments.

| Locality | Indicative Rs/sq.ft (2026) | Source |
|---|---|---|
| Worli Sea Face | ~64,000–66,000 avg (projects 62,000–75,000) | 99acres, SquareYards |
| Bandra West sea-view | ~64,000 avg; Carter Rd 65,000–80,000; Pali Hill 95,000+ | RealEstateMumbai, LuxeRealty |
| Juhu | ~61,000 | RealEstateMumbai |
| Prabhadevi | ~62,850–66,650 | 99acres, SquareYards |
| Versova | ~42,250 | 99acres |
| Marine Drive | 60,000–1,50,000+ (heritage, limited supply) | 99acres, MumbaiPropertyExchange |

## 7. TODO markers seeded in code (Task 19 punch list)
- TODO: Smit add NAP (homepage Organization schema)
- TODO: Smit verify WhatsApp number (new CTAs)
- TODO: Smit confirm Meridian Worli status
- TODO: Smit verify — every indicative Rs/sq.ft figure on locality + Worli pages
