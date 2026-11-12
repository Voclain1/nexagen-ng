import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AccessPanel } from "@/components/paywall";
import { Breadcrumbs } from "@/components/seo";
import { VideoPlayer } from "@/components/video-player";
import { checkAccess } from "@/lib/access";
import { formatDuration, getCourse, getResource } from "@/lib/content";
import { MDXContent } from "@/lib/mdx";

async function load(params: Promise<{ course: string; lesson: string }>) {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const course = getCourse(courseSlug);
  const lesson = course?.lessons.find((l) => l.slug === lessonSlug);
  return course && lesson ? { course, lesson } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ course: string; lesson: string }> }): Promise<Metadata> {
  const data = await load(params);
  if (!data) return {};
  const { course, lesson } = data;
  const indexable = !course.draft && (lesson.preview || course.access === "free");
  return { title: `${lesson.title} — ${course.title}`, description: lesson.description, alternates: { canonical: `/learn/${course.slug}/${lesson.slug}/` }, robots: indexable ? undefined : { index: false, follow: true } };
}

export default async function LessonPage({ params }: { params: Promise<{ course: string; lesson: string }> }) {
  const data = await load(params);
  if (!data) notFound();
  const { course, lesson } = data;
  const state = await checkAccess(course);
  const unlocked = lesson.preview || state.status === "open";
  const index = course.lessons.indexOf(lesson);
  const prev = course.lessons[index - 1], next = course.lessons[index + 1];
  const resources = lesson.resources.map(getResource).filter((r) => r !== undefined);

  return <section className="lesson"><div className="wrap lesson-layout">
    <div className="lesson-main">
      <Breadcrumbs items={[{ name: "Learn", path: "/learn/" }, { name: course.title, path: `/learn/${course.slug}/` }, { name: lesson.title, path: `/learn/${course.slug}/${lesson.slug}/` }]} />
      <p className="eyebrow">{lesson.module} · Lesson {lesson.order} of {course.lessons.length}{lesson.durationSeconds ? ` · ${formatDuration(lesson.durationSeconds)}` : ""}</p>
      <h1>{lesson.title}</h1>
      {unlocked ? <>
        {lesson.video && <VideoPlayer source={lesson.video} title={lesson.title} priority />}
        <div className="prose"><MDXContent source={lesson.body} /></div>
        {resources.length > 0 && <div className="lesson-resources"><p className="eyebrow">Lesson resources</p>{resources.map((r) => <Link key={r.slug} href={`/learn/resources/${r.slug}/`}>{r.title} ↗</Link>)}</div>}
      </> : <div className="locked">
        <p className="lead">{lesson.description}</p>
        <div className="locked-box"><p className="eyebrow">🔒 This lesson is part of the full course</p><AccessPanel product={course} state={state} startHref={`/learn/${course.slug}/${lesson.slug}/`} /></div>
      </div>}
      <nav className="lesson-nav" aria-label="Lesson navigation">
        {prev ? <Link href={`/learn/${course.slug}/${prev.slug}/`}>← {prev.title}</Link> : <span />}
        {next ? <Link href={`/learn/${course.slug}/${next.slug}/`}>{next.title} →</Link> : <Link href={`/learn/${course.slug}/`}>Back to course overview →</Link>}
      </nav>
    </div>
    <aside className="lesson-aside"><p className="eyebrow"><Link href={`/learn/${course.slug}/`}>{course.title}</Link></p>
      {course.modules.map((module) => <div key={module.title} className="lesson-module"><p>{module.title}</p><ol>{module.lessons.map((l) => <li key={l.slug} className={l.slug === lesson.slug ? "current" : undefined}>
        {(l.preview || state.status === "open") ? <Link href={`/learn/${course.slug}/${l.slug}/`} aria-current={l.slug === lesson.slug ? "page" : undefined}>{l.title}</Link> : <span>🔒 {l.title}</span>}
      </li>)}</ol></div>)}
    </aside>
  </div></section>;
}
