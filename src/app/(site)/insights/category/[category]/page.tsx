import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsletterBand, PostCard } from "@/components/content-ui";
import { Breadcrumbs, JsonLd } from "@/components/seo";
import { CtaBand, PageIntro } from "@/components/site-shell";
import { getCategories, getCategory, getPostsByCategory } from "@/lib/content";
import { itemListSchema } from "@/lib/schema";

export const revalidate = 3600;
export function generateStaticParams() { return getCategories().map((c) => ({ category: c.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const category = getCategory((await params).category);
  if (!category) return {};
  const posts = getPostsByCategory(category.slug);
  return { title: `${category.name} guides & insights`, description: category.description, alternates: { canonical: `/insights/category/${category.slug}/` }, robots: posts.length ? undefined : { index: false, follow: true } };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const category = getCategory((await params).category);
  if (!category) notFound();
  const posts = getPostsByCategory(category.slug);
  return <>
    <JsonLd data={itemListSchema(posts.map((p) => ({ url: `/insights/${p.slug}/`, name: p.title })))} />
    <PageIntro eyebrow="Insights · Topic" title={category.name} lead={category.description} />
    <section className="section soft"><div className="wrap">
      <Breadcrumbs items={[{ name: "Insights", path: "/insights/" }, { name: category.name, path: `/insights/category/${category.slug}/` }]} />
      <nav className="chip-row" aria-label="Topics"><Link href="/insights/" className="chip">All</Link>{getCategories().map((c) => <Link key={c.slug} href={`/insights/category/${c.slug}/`} className={`chip${c.slug === category.slug ? " active" : ""}`}>{c.name}</Link>)}</nav>
      {posts.length ? <div className="post-grid">{posts.map((post) => <PostCard key={post.slug} post={post} />)}</div> : <p className="empty">New {category.name.toLowerCase()} guides are in the works.</p>}
    </div></section>
    <NewsletterBand source={`category-${category.slug}`} />
    <CtaBand />
  </>;
}
