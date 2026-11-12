import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorBox } from "@/components/content-ui";
import { AccessPanel } from "@/components/paywall";
import { Breadcrumbs, JsonLd } from "@/components/seo";
import { CtaBand } from "@/components/site-shell";
import { VideoPlayer } from "@/components/video-player";
import { checkAccess } from "@/lib/access";
import { formatDuration, getCourse } from "@/lib/content";
import { MDXContent } from "@/lib/mdx";
import { courseSchema } from "@/lib/schema";

export async function generateMetadata({ params }: { params: Promise<{ course: string }> }): Promise<Metadata> {
  const course = getCourse((await params).course);
  return course ? { title: `${course.title} (course)`, description: course.description, alternates: { canonical: `/learn/${course.slug}/` }, robots: course.draft ? { index: false, follow: false } : undefined, openGraph: { title: course.title, description: course.description, url: `/learn/${course.slug}/` } } : {};
}

export default async function CoursePage({ params, searchParams }: { params: Promise<{ course: string }>; searchParams: Promise<{ checkout?: string; purchased?: string }> }) {
  const course = getCourse((await params).course);
  if (!course) notFound();
  const query = await searchParams;
  const state = await checkAccess(course);
  const first = course.lessons[0];
  const totalSeconds = course.lessons.reduce((t, l) => t + (l.durationSeconds ?? 0), 0);
  const canOpen = (preview: boolean) => state.status === "open" || preview;

  return <>
    <JsonLd data={courseSchema(course)} />
    <section className="course-hero"><div className="wrap">
      <Breadcrumbs items={[{ name: "Learn", path: "/learn/" }, { name: course.title, path: `/learn/${course.slug}/` }]} />
      <div className="course-hero-grid">
        <div>
          <p className="eyebrow light">Course · {course.level} · {course.lessons.length} lessons{totalSeconds ? ` · ${Math.round(totalSeconds / 60)} min` : ""}{course.draft && <span className="badge draft">Draft</span>}</p>
          <h1>{course.title}</h1>
          <p className="course-lead">{course.description}</p>
          {course.trailer && <div style={{ marginTop: 40 }}><VideoPlayer source={course.trailer} title={`${course.title} — trailer`} priority /></div>}
        </div>
        <AccessPanel product={course} state={state} startHref={first ? `/learn/${course.slug}/${first.slug}/` : "#curriculum"} checkout={query.checkout} purchased={query.purchased === "1"} />
      </div>
    </div></section>

    <section className="section"><div className="wrap course-body">
      <div>
        {course.outcomes.length > 0 && <><h2 className="h-sm">What you’ll be able to do</h2><ul className="check-list">{course.outcomes.map((o) => <li key={o}>{o}</li>)}</ul></>}
        <div className="prose"><MDXContent source={course.body} /></div>
        <h2 className="h-sm" id="curriculum">Curriculum</h2>
        <div className="curriculum">{course.modules.map((module, mi) => <div key={module.title} className="curriculum-module">
          <p className="eyebrow">Module {mi + 1}</p><h3>{module.title}</h3>
          <ol>{module.lessons.map((lesson) => <li key={lesson.slug}>
            {canOpen(lesson.preview) ? <Link href={`/learn/${course.slug}/${lesson.slug}/`}>{lesson.title}</Link> : <span>{lesson.title}</span>}
            <span className="lesson-meta">{lesson.preview && state.status !== "open" && <span className="badge free">Preview</span>}{!canOpen(lesson.preview) && <span aria-label="Locked">🔒</span>}{lesson.durationSeconds ? formatDuration(lesson.durationSeconds) : ""}</span>
          </li>)}</ol>
        </div>)}</div>
        {course.audience.length > 0 && <><h2 className="h-sm">Who it’s for</h2><ul className="check-list">{course.audience.map((a) => <li key={a}>{a}</li>)}</ul></>}
        <AuthorBox slug={course.instructor} label="Your instructor" />
      </div>
    </div></section>
    <CtaBand />
  </>;
}
