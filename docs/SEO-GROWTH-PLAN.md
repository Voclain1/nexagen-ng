# nexagen.ng SEO audit & growth plan

_Prepared November 2026 from a crawl of the live site and the new codebase. Review monthly._

**Goal:** make nexagen.ng the most trusted source of practical guidance for Nigerian businesses buying websites, online stores and digital platforms, and turn that trust into (1) qualified project enquiries and (2) email subscribers and buyers on Nexagen Learn.

---

## 1. Baseline

| Signal | Status | Source |
| --- | --- | --- |
| Domain Rating | **0** | Ahrefs, 12 Nov 2026 |
| Indexable pages | 9 (sitemap) | live crawl |
| Words per inner page | **129–241** (home: ~1,100) | live crawl |
| Published articles | **0**: the 3 homepage and 6 Insights cards are teasers with no articles behind them | live crawl |
| Search Console data | Not connected. This is the first task | — |

What it means: a new domain with no links and thin pages. Early wins come from **depth, local relevance, technical correctness and long-tail buyer questions**. Head terms such as "web design company in Nigeria" follow once authority builds.

---

## 2. Technical audit of the live site

### Fixed by the migration (this repo)

| Issue on the live site | Impact | Fix |
| --- | --- | --- |
| Contact form opened the visitor's mail app (`mailto:`) | Lost leads on any device without a mail client | Server-side form + Resend email, honeypot spam protection |
| No canonical tags (except the Lagos page) | Duplicate/parameter URLs can compete | Canonical on every page |
| `www.nexagen.ng` served a full duplicate of the site | Split signals, duplicate content | Permanent redirect www → apex |
| Missing trailing slash returned **307 (temporary)** | Link equity not consolidated | 308 permanent (Next.js `trailingSlash`) |
| No favicon (`/favicon.ico` → 404) | Untrustworthy look in tabs and Google results | Generated icon |
| No Open Graph / social tags | Bare link previews on WhatsApp, LinkedIn, X | OG + Twitter tags and a branded share image per page |
| No Organization/LocalBusiness schema on the homepage | Weak entity understanding | `Organization` + `ProfessionalService` with phone, address and area served; `WebSite` |
| Homepage FAQ had no structured data | Missed rich results and AI-answer extraction | `FAQPage` |
| Two different headers/footers (homepage vs inner pages); footer missing key links | Inconsistent UX, weak internal linking | One header with Learn added; footer links every service page, the Lagos page, Insights, Videos, Learn, phone and email |
| Homepage Insights cards weren't links | Dead ends | Cards link to `/insights/` |
| Lime CTA buttons had white text on lime | Fails contrast (accessibility) | Dark text |
| No blog, RSS, video or course infrastructure | No way to build topical authority | Full Insights / Videos / Learn system |
| No security headers | Best practice | nosniff, referrer policy, frame options, permissions policy |

All existing URLs, `<title>`s and meta descriptions are unchanged, so the migration itself is ranking-neutral. See `docs/MIGRATION.md`.

### Still open

| # | Issue | Action | Effort |
| --- | --- | --- | --- |
| T1 | Search Console / Bing not verified | Do it **before** the DNS switch to capture a baseline (MIGRATION.md §1) | 30 m |
| T2 | No analytics | Vercel Web Analytics + Speed Insights (or Plausible). Track `generate_lead` (contact), `sign_up`, `purchase`, WhatsApp clicks | 1 h |
| T3 | Thin service pages (129–241 words) | Expand each to 800–1,500 words: process, what's included, timelines, FAQs, a relevant case study, pricing guidance | 1 day each |
| T4 | No pages for e-commerce, SEO, automation and support services (cards link to `/contact/`) | Create `/services/ecommerce-development/`, `/services/seo/`, `/services/business-automation/`, `/services/website-maintenance/` | 1 day each |
| T5 | `/web-design-company-lagos/` is linked only from one service page and the footer | Link it from the homepage and About. Add Lagos-specific proof: clients, a map, reviews | 2 h |
| T6 | Case studies are cards that link off-site | Build `/work/schoolkit/`, `/work/betgenius/` and `/work/everydaynaira/`, each with the problem, approach, results, screenshots and a client quote | per case |
| T7 | No named people (About says nothing about who's behind Nexagen) | Add the team to About and author profiles (`content/authors/`) | 2 h |
| T8 | Field Core Web Vitals unknown | Check PageSpeed after launch. Targets: LCP < 2.5 s, INP < 200 ms, CLS < 0.1 on mobile | 1 h |

### Monthly technical check (1 hour)

1. Search Console → Pages: new "Crawled – not indexed", 404s, canonical issues.
2. Search Console → Enhancements: Breadcrumbs, FAQ, Videos, Course. Fix any errors.
3. Crawl (Screaming Frog, free ≤ 500 URLs): broken links, orphan pages, title/description lengths.
4. PageSpeed Insights (mobile) on the home page, a service page and the top article.

---

## 3. Topic strategy

Each cluster has a **pillar guide** (2,500+ words) linked to 6–12 **spokes** (1,200–2,000 words). Every article links to its matching **service page**. Service pages target commercial queries. Articles answer the questions buyers ask before they're ready to enquire.

| Cluster | Service page it feeds | Pillar | Spokes (first ones are already drafted/outlined) |
| --- | --- | --- | --- |
| **Website planning & cost** | `/services/website-design/` | The complete guide to getting a business website in Nigeria | Website cost in Nigeria ✎; 5 signs your website is limiting the business ✎; how to brief a web agency; WordPress vs custom; who should own your domain and hosting; website maintenance costs |
| **E-commerce in Nigeria** | `/services/ecommerce-development/` (T4) | How to sell online in Nigeria: the practical guide | What makes customers trust an online store ✎; Paystack vs Flutterwave; delivery and logistics options; Instagram/WhatsApp selling vs a store |
| **SEO & local growth** | `/services/seo/` (T4), `/web-design-company-lagos/` | SEO for Nigerian businesses | What to fix before investing in SEO ✎; Google Business Profile for Lagos businesses; local SEO beyond Lagos; how long SEO takes |
| **Platforms & automation** | `/services/custom-platforms/` | When your business needs software, not a website | Website or custom platform ✎ (complete draft); when to automate a workflow ✎; school management software (SchoolKit story); building a marketplace in Nigeria |
| **Industry pages** | `/services/…` | — | Websites for schools, clinics, law firms, real estate and logistics. Write one only when we have real experience and an example in that sector |

✎ = draft in `content/posts/`.

**City pages:** keep the Lagos page and make it genuinely useful. Add Abuja or Port Harcourt pages only with real clients or a presence there. Near-duplicate city pages are treated as doorway pages.

**Keyword research to run first** (Search Console after 4–6 weeks; Google Keyword Planner; Ahrefs/Semrush when credits are available):
- Seed terms per cluster, plus "Nigeria", "Lagos", "in naira" and "price" modifiers. Filter for low difficulty.
- Mine Google "People also ask", Nairaland, X and Facebook business groups for how Nigerian owners actually phrase questions.
- Do a competitor gap analysis against 3–5 Nigerian agencies that already rank. Pick them after the first data pull.

---

## 4. E-E-A-T: show the real people and real work

1. **Named authors.** Add founder and lead profiles with photos, bios and LinkedIn links (`content/authors/*.json`), and byline the articles.
2. **First-hand evidence in every guide.** Real price ranges from our proposals, screenshots from our builds, lessons from SchoolKit/BetGenius/EverydayNaira. This is what generic AI content can't copy.
3. **Proof on the site.** Client logos, testimonials with names, before/after metrics and the "40+ websites / 4+ years" claims backed by a portfolio page.
4. **Business identity.** A consistent name, address, phone and email everywhere (`src/lib/config.ts` feeds the schema). Add a registered business address when you're comfortable showing one.

---

## 5. Video

- Publish on **YouTube first** for discovery, then embed on `/videos/<slug>/` with the transcript, chapters and links. Google indexes the page. YouTube brings the audience.
- Format ideas: website teardowns of Nigerian businesses (with permission), "what a ₦X website gets you", Paystack setup walkthroughs, short client stories.
- Cadence: 2 per month to start. Cut 3–5 shorts from each for Instagram, TikTok and YouTube Shorts.
- Paid lesson videos go on **Bunny Stream** (cheapest, token-protected) or **Mux** (signed). Never use unlisted YouTube for paid content.

---

## 6. Nexagen Learn: the lead and revenue flywheel

```
Articles + YouTube → email-gated templates/checklists → newsletter → paid course / project enquiry
```

- **Lead magnets first.** The website project brief template is drafted (`access: email`). Add a "website launch checklist" and an "online store readiness checklist", and link each from every article in its cluster with a `<Cta>`.
- **First paid course.** "Plan a business website that wins customers" is scaffolded at ₦15,000 with a free preview lesson. Price and content are placeholders until you decide.
- Every course sale is also a warm agency lead. Offer course buyers a discounted consultation.

---

## 7. Authority building

The goal is DR 15+ in 6 months from **relevant Nigerian and industry links**.

| Tactic | Detail | Cadence |
| --- | --- | --- |
| Client credits | "Website by Nexagen" footer link on client sites (SchoolKit, BetGenius and EverydayNaira first) | Every project |
| Google Business Profile | Create and verify for Lagos, add photos and services, ask every happy client for a review | Now, then ongoing |
| Directories | Clutch, GoodFirms, DesignRush, VConnect, BusinessList.com.ng, LinkedIn company page | Once |
| Nigerian tech press | Pitch data stories and founder commentary to TechCabal, Techpoint Africa, Benjamin Dada, Nairametrics (SME angle) | Monthly |
| Original data | "State of Nigerian SME websites": audit 300 business sites for speed, mobile UX and HTTPS, then publish the results | Quarterly |
| Free tools | Website cost estimator (NGN), Paystack fee calculator, WhatsApp link generator | 1 per quarter |
| Community & events | Talks at Lagos startup and SME events, guest posts and podcasts in the Nigerian business ecosystem | Monthly |

---

## 8. AI search (Google AI Overviews, ChatGPT, Perplexity)

- Lead every article with a direct answer (`<KeyTakeaways>`), use question-shaped H2s and real FAQs.
- Publish specific Nigerian numbers and named frameworks. These get cited. Generic advice does not.
- Keep the entity consistent: the same name, description and links everywhere. Add social profile URLs to `siteConfig.sameAs` as they go live.

---

## 9. Measurement

| KPI | Month 3 | Month 6 | Month 12 |
| --- | --- | --- | --- |
| Indexed pages | 30 | 60 | 120 |
| Organic clicks / month | 300 | 1,500 | 6,000 |
| Keywords in top 10 (Nigeria) | 10 | 50 | 150 |
| Referring domains | 15 | 35 | 80 |
| Email subscribers | 150 | 700 | 2,500 |
| Qualified enquiries from organic + content | 3 / mo | 8 / mo | 20 / mo |

These targets are directional. Re-set them after 60 days of Search Console data.

---

## 10. 90-day roadmap

**Weeks 1–2: migrate and measure**
- Search Console baseline → deploy → DNS switch (`docs/MIGRATION.md`).
- Analytics (T2). Google Business Profile. Named team on About (T7).
- Review and publish *Website or custom platform* and the brief template (remove `draft: true`).

**Weeks 3–6: fix thin pages, start publishing**
- Expand the 4 existing service pages (T3) and create the 4 missing ones (T4).
- Write and publish the 5 outlined articles. Start with *Website cost in Nigeria*, the highest-intent topic.
- First 2 YouTube videos.

**Weeks 7–10: proof and authority**
- 3 case-study pages (T6). Ask those clients for credit links and reviews.
- 2 pillar guides. Directory listings. First press pitch.

**Weeks 11–13: monetise and review**
- Launch the first paid course with free preview lessons.
- Start the SME website data study.
- 90-day review: refresh pages ranking in positions 8–20, merge anything with no impressions, plan the next quarter.

**Ongoing cadence:** 2 articles/week, 2 videos/month, 1 lead magnet/month, 1 data piece or tool/quarter.
