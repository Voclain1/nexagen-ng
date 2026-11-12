# Moving nexagen.ng from ChatGPT sites to GitHub + Vercel

The new build keeps every existing URL, `<title>` and meta description, so search engines see an upgrade, not a new site. Follow the steps in order. Expect about an hour of work plus DNS propagation.

## 1. Before the switch

- [ ] Verify nexagen.ng in **Google Search Console** (Domain property, via a DNS TXT record) **now**, while the old site is live. That gives you a baseline of current queries and pages. Export the Performance report (last 3 months).
- [ ] Note where DNS is managed today (the registrar, or Cloudflare: the live site is served through Cloudflare).
- [ ] Make sure you can log in to the domain registrar.

## 2. Deploy to Vercel (no downtime yet)

1. vercel.com → **Add New → Project** → import `Voclain1/nexagen-ng`. The framework preset is detected automatically.
2. Set the **Environment Variables** listed in `.env.example`. The minimum for launch is:
   - `NEXT_PUBLIC_SITE_URL=https://nexagen.ng`
   - `AUTH_SECRET` (run `openssl rand -base64 48`)
   - `RESEND_API_KEY` and `EMAIL_FROM`. The contact form needs these. Verify nexagen.ng in Resend first (it adds DNS records).
   - `DATABASE_URL` (Neon or Supabase free tier). Only needed once you publish an email-gated or paid course/resource.
   - `PAYSTACK_SECRET_KEY`. Only needed when you sell something.
3. Deploy. Check the preview URL (`*.vercel.app`): every page, the contact form (send yourself a test) and the mobile menu.

## 3. Switch the domain

1. Vercel → Project → **Settings → Domains** → add `nexagen.ng` and `www.nexagen.ng`. Set **www → redirect to nexagen.ng (308)**. The live site currently serves duplicate content on www, and this fixes it.
2. At your DNS provider, replace the current records with what Vercel shows:
   - `A  @  76.76.21.21` (or the value Vercel displays)
   - `CNAME  www  cname.vercel-dns.com`
   - If DNS is on Cloudflare, set these records to **DNS only** (grey cloud) so Vercel can issue SSL.
3. Wait for Vercel to show the domain as valid with SSL issued. This usually takes minutes but can take up to 48 hours.
4. Remove or unpublish the site in ChatGPT sites **only after** nexagen.ng is serving from Vercel.

## 4. Right after go-live

- [ ] Visit every URL in the old sitemap. Each one should return 200 with the same title:
  `/`, `/services/`, `/services/website-design/`, `/services/custom-platforms/`, `/web-design-company-lagos/`, `/work/`, `/about/`, `/insights/`, `/contact/`
- [ ] `https://www.nexagen.ng/` → 308 to `https://nexagen.ng/`, and `/services` → 308 to `/services/`
- [ ] Search Console → **Sitemaps** → submit `https://nexagen.ng/sitemap.xml`. Use **URL Inspection → Request indexing** for the home and service pages.
- [ ] Set `GOOGLE_SITE_VERIFICATION` if you use the HTML-tag method, and `BING_SITE_VERIFICATION` after adding the site to Bing Webmaster Tools. Bing can import from Search Console.
- [ ] Paystack dashboard → Settings → API Keys & Webhooks → webhook URL `https://nexagen.ng/api/paystack/webhook/`. The trailing slash matters.
- [ ] Send a real enquiry through `/contact/` and confirm it arrives at hello@nexagen.ng.

## 5. The two weeks after

Watch Search Console → Pages and Performance. Small ranking fluctuation in the first week is normal. If a page drops out of the index, inspect it with URL Inspection and request indexing again.

## Rollback

If something goes badly wrong, point the DNS records back to their previous values. The ChatGPT site keeps working as long as you haven't deleted it, which is why step 3.4 comes last.
