import { getCategory, getPost, getPosts } from "@/lib/content";
import { renderOg, ogSize } from "@/lib/og";

export const alt = "Nexagen Insights article";
export const size = ogSize;
export const contentType = "image/png";
export function generateStaticParams() { return getPosts().map((p) => ({ slug: p.slug })); }
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  return renderOg({ eyebrow: post ? (getCategory(post.category)?.name ?? "Insights") : "Insights", title: post?.title ?? "Nexagen Insights", footer: post ? `${post.readingMinutes} min read · nexagen.ng/insights` : undefined });
}
