import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterBand, VideoCard } from "@/components/content-ui";
import { JsonLd } from "@/components/seo";
import { CtaBand, PageIntro } from "@/components/site-shell";
import { getVideos } from "@/lib/content";
import { itemListSchema } from "@/lib/schema";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Video guides for Nigerian businesses", description: "Short, practical video guides from Nexagen on planning websites, online stores, SEO and business technology in Nigeria.", alternates: { canonical: "/videos/" }, robots: { index: getVideos().some((v) => !v.draft), follow: true } };

export default function Videos() {
  const videos = getVideos();
  return <>
    <JsonLd data={itemListSchema(videos.map((v) => ({ url: `/videos/${v.slug}/`, name: v.title })))} />
    <PageIntro eyebrow="Nexagen videos" title="Watch, then decide with" accent="confidence." lead="Walkthroughs and plain-language explainers on websites, online stores, search and business technology—each with chapters, notes and a transcript." />
    <section className="section soft"><div className="wrap">
      {videos.length ? <div className="video-grid">{videos.map((v) => <VideoCard key={v.slug} video={v} />)}</div> : <div className="empty-state"><h2>First episodes are in production.</h2><p>Subscribe below and we’ll send them as they’re released, or start with our <Link href="/insights/">written guides</Link>.</p></div>}
    </div></section>
    <NewsletterBand source="videos" title="Get new videos as they drop." />
    <CtaBand />
  </>;
}
