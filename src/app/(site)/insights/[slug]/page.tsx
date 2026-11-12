import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorBox, NewsletterBand, PostCard, ShareLinks, TableOfContents } from "@/components/content-ui";
import { Breadcrumbs, JsonLd } from "@/components/seo";
import { CtaBand } from "@/components/site-shell";
import { VideoPlayer } from "@/components/video-player";
import { formatDate, getAuthor, getCategory, getPost, getPosts, getRelatedPosts, getVideo } from "@/lib/content";
import { MDXContent } from "@/lib/mdx";
import { articleSchema, faqSchema, videoSchema } from "@/lib/schema";

export const revalidate = 3600;
export function generateStaticParams() { return getPosts().map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const author = getAuthor(post.author);
  return {
    title: post.title,
    description: post.description,
    keywords: [post.keyword, ...post.tags].filter(Boolean) as string[],
    authors: author ? [{ name: author.name, url: author.organization ? undefined : `/authors/${author.slug}/` }] : undefined,
    alternates: { canonical: post.canonical ?? `/insights/${post.slug}/` },
    robots: post.draft ? { index: false, follow: false } : undefined,
    openGraph: { type: "article", title: post.title, description: post.description, url: `/insights/${post.slug}/`, publishedTime: post.date, modifiedTime: post.updated ?? post.date, section: getCategory(post.category)?.name, tags: post.tags, ...(post.cover ? { images: [{ url: post.cover, alt: post.coverAlt ?? post.title }] } : {}) },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const category = getCategory(post.category)!;
  const author = getAuthor(post.author);
  const video = post.video ? getVideo(post.video) : undefined;
  const related = getRelatedPosts(post);
  const path = `/insights/${post.slug}/`;

  return <>
    <JsonLd data={[articleSchema(post), ...(post.faq.length ? [faqSchema(post.faq)] : []), ...(video ? [videoSchema(video)] : [])]} />
    <article className="article">
      <header className="article-header"><div className="wrap article-header-inner">
        <Breadcrumbs items={[{ name: "Insights", path: "/insights/" }, { name: category.name, path: `/insights/category/${category.slug}/` }, { name: post.title, path }]} />
        <p className="eyebrow"><Link href={`/insights/category/${category.slug}/`}>{category.name}</Link> · {post.readingMinutes} min read{post.draft && <span className="badge draft">Draft</span>}</p>
        <h1>{post.title}</h1>
        <p className="lead">{post.description}</p>
        <div className="article-byline">
          <span>By <strong>{author?.organization ? author.name : <Link href={`/authors/${post.author}/`}>{author?.name}</Link>}</strong></span>
          <span>Published <time dateTime={post.date}>{formatDate(post.date)}</time></span>
          {post.updated && <span>Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time></span>}
        </div>
      </div></header>

      <div className="wrap article-layout">
        <div className="article-main">
          {post.cover && <figure className="article-cover"><Image src={post.cover} alt={post.coverAlt ?? ""} width={1600} height={900} priority sizes="(max-width: 1000px) 100vw, 780px" /></figure>}
          {video && <figure className="article-cover"><VideoPlayer source={video.source} title={video.title} priority /><figcaption><Link href={`/videos/${video.slug}/`}>Watch with chapters &amp; transcript →</Link></figcaption></figure>}
          <div className="prose"><MDXContent source={post.body} /></div>
          {post.faq.length > 0 && <section className="faq" aria-labelledby="faq-heading"><h2 id="faq-heading">Frequently asked questions</h2>{post.faq.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</section>}
          <ShareLinks path={path} title={post.title} />
          <AuthorBox slug={post.author} />
        </div>
        <aside className="article-aside"><TableOfContents headings={post.headings} /><div className="aside-cta"><p className="eyebrow">Work with us</p><p>Need this done properly on your product?</p><Link className="button button-small dark" href="/contact/">Start a project ↗</Link></div></aside>
      </div>
    </article>

    {related.length > 0 && <section className="section related"><div className="wrap"><div className="section-head"><div><p className="eyebrow">Keep reading</p><h2>Related insights.</h2></div><Link href={`/insights/category/${category.slug}/`} className="text-link">More on {category.name} →</Link></div><div className="post-grid">{related.map((p) => <PostCard key={p.slug} post={p} />)}</div></div></section>}
    <NewsletterBand source={`post-${post.slug}`} />
    <CtaBand />
  </>;
}
