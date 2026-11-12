import { absoluteUrl, siteConfig } from "@/lib/config";
import { getCategory, getPosts } from "@/lib/content";

export const revalidate = 3600;
const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);

/** RSS 2.0 feed — for readers, newsletter automation (Resend/Zapier) and syndication. */
export function GET() {
  const posts = getPosts().filter((p) => !p.draft).slice(0, 50);
  const items = posts.map((p) => `<item><title>${esc(p.title)}</title><link>${absoluteUrl(`/insights/${p.slug}/`)}</link><guid isPermaLink="true">${absoluteUrl(`/insights/${p.slug}/`)}</guid><description>${esc(p.description)}</description><category>${esc(getCategory(p.category)?.name ?? p.category)}</category><pubDate>${new Date(p.date).toUTCString()}</pubDate></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${esc(siteConfig.name)} Insights</title><link>${absoluteUrl("/insights/")}</link><description>${esc(siteConfig.description)}</description><language>en</language><atom:link href="${absoluteUrl("/insights/feed.xml")}" rel="self" type="application/rss+xml"/>${posts[0] ? `<lastBuildDate>${new Date(posts[0].updated ?? posts[0].date).toUTCString()}</lastBuildDate>` : ""}${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
