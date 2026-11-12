import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/content-ui";
import { Breadcrumbs, JsonLd } from "@/components/seo";
import { CtaBand } from "@/components/site-shell";
import { getAuthor, getAuthors, getPostsByAuthor } from "@/lib/content";
import { personSchema } from "@/lib/schema";

/** Author profile pages: a core E-E-A-T signal for an authority publication. */
export function generateStaticParams() { return getAuthors().filter((a) => !a.organization).map((a) => ({ slug: a.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const author = getAuthor((await params).slug);
  return author && !author.organization ? { title: `${author.name}, ${author.role}`, description: author.bio, alternates: { canonical: `/authors/${author.slug}/` }, openGraph: { type: "profile" } } : {};
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const author = getAuthor((await params).slug);
  if (!author || author.organization) notFound();
  const posts = getPostsByAuthor(author.slug);
  return <>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "ProfilePage", mainEntity: personSchema(author.slug) }} />
    <section className="hero author-intro"><div className="wrap">
      <Breadcrumbs items={[{ name: "Insights", path: "/insights/" }, { name: author.name, path: `/authors/${author.slug}/` }]} />
      <div className="author-hero">{author.avatar && <Image src={author.avatar} alt={author.name} width={160} height={160} priority />}<div><p className="eyebrow">{author.role}</p><h1>{author.name}</h1></div></div>
      <p className="page-lead">{author.bio}</p>
      {author.expertise?.length ? <div className="chip-row">{author.expertise.map((e) => <span key={e} className="chip">{e}</span>)}</div> : null}
      {author.sameAs?.length ? <p className="author-links">{author.sameAs.map((url) => <a key={url} href={url} target="_blank" rel="me noopener">{new URL(url).hostname.replace("www.", "")} ↗</a>)}</p> : null}
    </div></section>
    <section className="section soft"><div className="wrap"><div className="post-grid">{posts.map((p) => <PostCard key={p.slug} post={p} />)}</div></div></section>
    <CtaBand />
  </>;
}
