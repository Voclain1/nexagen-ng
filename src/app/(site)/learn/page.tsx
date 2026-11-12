import type { Metadata } from "next";
import Link from "next/link";
import { CourseCard, NewsletterBand, ResourceCard, VideoCard } from "@/components/content-ui";
import { JsonLd } from "@/components/seo";
import { CtaBand, PageIntro } from "@/components/site-shell";
import { getCourses, getResources, getVideos } from "@/lib/content";
import { itemListSchema } from "@/lib/schema";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Learn: courses, templates & guides for Nigerian businesses", description: "Courses, video lessons, templates and checklists from Nexagen to help Nigerian businesses plan, launch and grow online.", alternates: { canonical: "/learn/" }, robots: { index: [...getCourses(), ...getResources()].some((x) => !x.draft), follow: true } };

export default function Learn() {
  const courses = getCourses(), resources = getResources(), videos = getVideos().slice(0, 3);
  return <>
    <JsonLd data={itemListSchema(courses.map((c) => ({ url: `/learn/${c.slug}/`, name: c.title })))} />
    <PageIntro eyebrow="Nexagen Learn" title="Plan, launch and grow online with" accent="less guesswork." lead="Practical courses, templates and video lessons from the team building websites, stores and platforms for Nigerian businesses." />
    <section className="section soft"><div className="wrap">
      <div className="section-head"><div><p className="eyebrow">Courses</p><h2>Structured learning.</h2></div><Link href="/account/" className="text-link">My library →</Link></div>
      {courses.length ? <div className="course-grid">{courses.map((c) => <CourseCard key={c.slug} course={c} />)}</div> : <div className="empty-state"><h2>The first courses are on the way.</h2><p>Join the list below to get early access and launch pricing.</p></div>}
    </div></section>
    {resources.length > 0 && <section className="section resource-section"><div className="wrap"><div className="section-head"><div><p className="eyebrow">Resources</p><h2>Templates, checklists & toolkits.</h2></div></div><div className="resource-grid">{resources.map((r) => <ResourceCard key={r.slug} resource={r} />)}</div></div></section>}
    {videos.length > 0 && <section className="section"><div className="wrap"><div className="section-head"><div><p className="eyebrow">Free tutorials</p><h2>Watch and learn.</h2></div><Link href="/videos/" className="text-link">All videos →</Link></div><div className="video-grid">{videos.map((v) => <VideoCard key={v.slug} video={v} />)}</div></div></section>}
    <NewsletterBand source="learn" title="Be first in line for new courses." />
    <CtaBand />
  </>;
}
