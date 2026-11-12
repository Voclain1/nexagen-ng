# nexagen.ng

The Nexagen website: websites and digital platforms for Nigerian businesses. It's built with Next.js, TypeScript and MDX and deploys to Vercel.

It was migrated from the original ChatGPT-sites build with **identical URLs, titles and copy**, and extended with:

- **Insights** (blog): MDX articles, topics, authors, pagination, RSS, FAQ/Article schema, generated social images
- **Videos**: video pages with chapters, transcripts, VideoObject schema and a video sitemap (YouTube, Mux, Bunny Stream, MP4)
- **Learn** (LMS): courses with free preview lessons, email-gated and paid downloads, magic-link sign-in, Paystack checkout (NGN), learner library
- A working contact form (the original opened the visitor's mail app)

## Routes

| URL | Source |
| --- | --- |
| `/` | `src/app/page.tsx` (styles: `home.css`) |
| `/services/`, `/services/website-design/`, `/services/custom-platforms/`, `/web-design-company-lagos/`, `/work/`, `/about/`, `/contact/` | `src/app/(site)/…` (styles: `pages.css`) |
| `/insights/`, `/videos/`, `/learn/`, `/account/` | `src/app/(site)/…` + `content/` (styles: `content.css`) |

All URLs end with a slash (`trailingSlash: true`), matching the original site.

## Development

```bash
pnpm install
pnpm dev          # drafts are visible locally with a red "Draft" badge
pnpm lint && pnpm exec tsc --noEmit && pnpm build
```

Copy `.env.example` to `.env.local`. Every key is optional locally: emails print to the console, and course access is stored in `.data/`.

## Docs

- [`content/README.md`](content/README.md): how to publish articles, videos, courses and resources
- [`docs/MIGRATION.md`](docs/MIGRATION.md): moving nexagen.ng from ChatGPT sites to Vercel without losing rankings
- [`docs/SEO-GROWTH-PLAN.md`](docs/SEO-GROWTH-PLAN.md): audit findings and the growth roadmap
