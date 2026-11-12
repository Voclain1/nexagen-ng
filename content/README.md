# Publishing guide

**Current drafts:** `posts/website-or-custom-platform.mdx` (complete, needs review), five outlines matching the topics promised on the live Insights page, `resources/website-project-brief.mdx` (email-gated lead magnet) and an example paid course in `courses/plan-your-business-website/`.

All editorial content lives in this folder as MDX (Markdown + components). Commit a file, push, and Vercel deploys it.
Run `pnpm dev` to preview: drafts and future-dated items are visible locally (with a red **Draft** badge) and hidden in production.

| You want to publish… | Create | URL |
| --- | --- | --- |
| An article | `posts/<slug>.mdx` (copy `posts/_template.mdx`) | `/insights/<slug>/` |
| A video tutorial | `videos/<slug>.mdx` (copy `videos/_template.mdx`) | `/videos/<slug>/` |
| A course | `courses/<slug>/index.mdx` + `01-<lesson>.mdx`, `02-…` | `/learn/<slug>/` |
| A download (template, checklist, toolkit) | `resources/<slug>.mdx` + the file in `resources/files/` | `/learn/resources/<slug>/` |
| A new author | `authors/<first-last>.json` (see `_example-person.json.txt`) | `/authors/<first-last>/` |
| A new blog category | add to `categories.json` (with a real description) | `/insights/category/<slug>/` |

Files starting with `_` are ignored. The filename is the URL. Choose it once; changing it later breaks links and loses rankings.

## Publishing workflow

1. Copy the template and write with `draft: true`.
2. Preview with `pnpm dev`. Check the headings in the table of contents, the links and the mobile layout.
3. Run the checklist below, then delete `draft: true`.
4. **Scheduling:** set `date` in the future. The post goes live within an hour of that date, because listing and article pages revalidate hourly.
5. **Refreshing:** when you materially update an article, set `updated:`. That updates the sitemap and `dateModified`.

### Pre-publish checklist

- [ ] One primary keyword (`keyword:`) that no other article targets. Don't cannibalise.
- [ ] Title ≤ 60 characters, with the keyword near the front. Description 140–160 characters.
- [ ] The answer to the query is in the first 100 words or in `<KeyTakeaways>`.
- [ ] 1,200+ words for guides. Depth beats volume.
- [ ] H2s phrased the way people search. Use `faq:` for real "People also ask" questions.
- [ ] Links to at least 1 service page, 2 related articles and, where relevant, a course or resource. Internal links end with `/` (e.g. `/services/website-design/`).
- [ ] Original insight: client experience, real Nigerian pricing, screenshots or a framework. Something an AI summary can't reproduce.
- [ ] Images go in `public/insights-media/<slug>/`, use `<Figure>` with width, height and descriptive alt text. Covers are 1600×900.

## Components you can use in MDX

```mdx
<KeyTakeaways>
- Summary bullet
</KeyTakeaways>

<Callout type="tip" title="Optional title">tip | note | warning</Callout>

<Video slug="my-video" />          {/* a video from content/videos */}
<YouTube id="VIDEO_ID" title="…" />                         {/* any public YouTube video */}

<Figure src="/insights-media/my-post/diagram.png" alt="…" width={1600} height={900} caption="…" />

<Cta href="/services/website-design/" title="Want this for your business?" label="Talk to us">One line.</Cta>
```

Plain Markdown also works: tables, task lists, footnotes and fenced code blocks (with syntax highlighting).

## Video hosting: which provider?

| Use case | Provider | Why |
| --- | --- | --- |
| Free videos (discovery) | **YouTube** (`provider: youtube`) | YouTube is the #2 search engine. Embeds are lazy-loaded, so they cost no performance until played. |
| Paid lessons | **Mux** (`provider: mux`, `signed: true`) or **Bunny Stream** (`provider: bunny`) | Signed, expiring playback URLs are generated only for learners with access. Bunny is the cheapest. Mux has the best analytics and player. |
| Short clips you host yourself | `provider: file`, `id: /videos/clip.mp4` | Simple, but no adaptive streaming. Keep files small. |

Each video page gets `VideoObject` structured data, chapters (Google "key moments") and a video-sitemap entry. Paste the transcript under `## Transcript` with `transcript: true`. That makes the page indexable and accessible.

## Courses and paid resources

- `access: free`: open to everyone and fully indexable.
- `access: email`: the learner signs in with a magic link, which builds your email list. This is the best option for lead magnets.
- `access: paid` plus `price: { amount: 25000, currency: NGN }`: one-time Paystack checkout, then lifetime access.
- Set `preview: true` on lessons that should be free samples. Preview lessons are indexable, so write them as good standalone pages.
- Paid lesson bodies and video URLs are never sent to people without access.
- Resource files in `resources/files/` are private. They are served only through `/api/resources/<slug>` after an access check.
- To grant free access (comps, reviewers, team), see `db/schema.sql`.
