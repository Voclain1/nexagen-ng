import Link from "next/link";
import { getCategories, getPosts, getVideos } from "@/lib/content";
import { itemListSchema } from "@/lib/schema";
import { NewsletterBand, Pagination, PostCard, VideoCard } from "./content-ui";
import { JsonLd } from "./seo";
import { CtaBand, PageIntro } from "./site-shell";

export const PAGE_SIZE = 12;
export const pageCount = () => Math.max(1, Math.ceil(getPosts().length / PAGE_SIZE));

/** /insights and /insights/page/N */
export function PostIndex({ page }: { page: number }) {
  const all = getPosts();
  const featured = page === 1 ? (all.find((p) => p.featured) ?? all[0]) : undefined;
  const rest = all.filter((p) => p !== featured).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const videos = page === 1 ? getVideos().slice(0, 3) : [];
  return <>
    <JsonLd data={itemListSchema([featured, ...rest].filter(Boolean).map((p) => ({ url: `/insights/${p!.slug}/`, name: p!.title })))} />
    {page === 1 ? <PageIntro eyebrow="Nexagen insights" title="Clear guidance for better" accent="digital decisions." lead="Practical Nigerian context for business owners planning websites, online stores, platforms, automation and long-term digital growth." /> : <PageIntro eyebrow="Nexagen insights" title={`Insights — page ${page}`} lead="More practical guidance for Nigerian businesses." />}
    <section className="section soft blog-index"><div className="wrap">
      <nav className="chip-row" aria-label="Topics"><Link href="/insights/" className="chip active">All</Link>{getCategories().map((c) => <Link key={c.slug} href={`/insights/category/${c.slug}/`} className="chip">{c.name}</Link>)}<Link href="/videos/" className="chip">Videos</Link><Link href="/learn/" className="chip">Courses</Link></nav>
      {!featured && <UpcomingGuides />}
      {featured && <PostCard post={featured} large />}
      <div className="post-grid">{rest.map((post) => <PostCard key={post.slug} post={post} />)}</div>
      <Pagination page={page} pages={pageCount()} base="/insights/" />
    </div></section>
    {videos.length > 0 && <section className="section video-strip"><div className="wrap"><div className="section-head"><div><p className="eyebrow">Watch</p><h2>Latest video tutorials.</h2></div><Link href="/videos/" className="text-link">All videos →</Link></div><div className="video-grid">{videos.map((v) => <VideoCard key={v.slug} video={v} />)}</div></div></section>}
    <NewsletterBand source={`insights-${page}`} />
    <CtaBand />
  </>;
}

/** Shown until the first article is published, so /insights/ never regresses from the live page. */
const upcoming = [
  { tag: "Website planning", title: "How much should a business website cost in Nigeria?", text: "Understand what changes the price, which shortcuts create problems and what a professional proposal should include.", href: "/contact/", cta: "Get the planning guide" },
  { tag: "Strategy", title: "Website or custom platform: which does your business need?", text: "A practical way to distinguish a marketing website from a product, portal or operational system.", href: "/services/custom-platforms/", cta: "Explore platforms" },
  { tag: "Local growth", title: "What Nigerian businesses need before investing in SEO", text: "Positioning, useful pages, technical foundations and the role of authority beyond publishing articles.", href: "/contact/", cta: "Plan your SEO foundation" },
  { tag: "E-commerce", title: "What makes Nigerian customers trust an online store?", text: "Clear delivery information, payment confidence, mobile usability and practical support signals.", href: "/contact/", cta: "Discuss an online store" },
  { tag: "Operations", title: "When should a growing business automate its workflow?", text: "How to recognise repetitive work that deserves integration—and what should remain human.", href: "/contact/", cta: "Explore automation" },
  { tag: "Redesign", title: "Five signs your website is now limiting the business", text: "Look beyond appearance to structure, trust, mobile performance, ownership and conversion problems.", href: "/services/website-design/", cta: "Plan a redesign" },
];
function UpcomingGuides() {
  return <div className="grid3">{upcoming.map((u) => <article key={u.title} className="article"><small>{u.tag.toUpperCase()}</small><h3>{u.title}</h3><p>{u.text}</p><Link href={u.href}>{u.cta} →</Link></article>)}</div>;
}
