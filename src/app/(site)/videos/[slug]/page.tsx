import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorBox, NewsletterBand, ShareLinks, VideoCard } from "@/components/content-ui";
import { Breadcrumbs, JsonLd } from "@/components/seo";
import { CtaBand } from "@/components/site-shell";
import { VideoPlayer } from "@/components/video-player";
import { formatDate, formatDuration, getCategory, getVideo, getVideos } from "@/lib/content";
import { MDXContent } from "@/lib/mdx";
import { videoSchema } from "@/lib/schema";
import { thumbnailFor } from "@/lib/video";

export const revalidate = 3600;
export function generateStaticParams() { return getVideos().map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const video = getVideo((await params).slug);
  if (!video) return {};
  const thumb = thumbnailFor(video.source);
  return { title: video.title, description: video.description, alternates: { canonical: `/videos/${video.slug}/` }, robots: video.draft ? { index: false, follow: false } : undefined, openGraph: { type: "video.other", title: video.title, description: video.description, url: `/videos/${video.slug}/`, ...(thumb ? { images: [thumb] } : {}) }, twitter: { card: "summary_large_image" } };
}

export default async function VideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const video = getVideo((await params).slug);
  if (!video) notFound();
  const more = getVideos().filter((v) => v.slug !== video.slug).slice(0, 3);
  const category = video.category ? getCategory(video.category) : undefined;
  return <>
    <JsonLd data={videoSchema(video)} />
    <section className="video-hero"><div className="wrap">
      <Breadcrumbs items={[{ name: "Videos", path: "/videos/" }, { name: video.title, path: `/videos/${video.slug}/` }]} />
      <VideoPlayer source={video.source} title={video.title} priority />
      <div className="video-hero-meta">
        <div><p className="eyebrow light">{category?.name ?? "Video tutorial"}{video.durationSeconds ? ` · ${formatDuration(video.durationSeconds)}` : ""}{video.draft && <span className="badge draft">Draft</span>}</p><h1>{video.title}</h1><p>{video.description}</p></div>
        <p className="video-date">Published <time dateTime={video.date}>{formatDate(video.date)}</time></p>
      </div>
    </div></section>
    <section className="section"><div className="wrap article-layout">
      <div className="article-main">
        <div className="prose"><MDXContent source={video.body} /></div>
        <ShareLinks path={`/videos/${video.slug}/`} title={video.title} />
        <AuthorBox slug={video.author} label="Presented by" />
      </div>
      {video.chapters.length > 0 && <aside className="article-aside"><nav className="toc chapters" aria-label="Chapters"><p className="eyebrow">Chapters</p><ol>{video.chapters.map((c) => <li key={c.time}><span>{c.time}</span>{c.title}</li>)}</ol></nav></aside>}
    </div></section>
    {more.length > 0 && <section className="section related"><div className="wrap"><div className="section-head"><div><p className="eyebrow">Up next</p><h2>More tutorials.</h2></div><Link href="/videos/" className="text-link">All videos →</Link></div><div className="video-grid">{more.map((v) => <VideoCard key={v.slug} video={v} />)}</div></div></section>}
    <NewsletterBand source={`video-${video.slug}`} title="Get new tutorials as they drop." />
    <CtaBand />
  </>;
}
