import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CourseCard, ResourceCard } from "@/components/content-ui";
import { getSession } from "@/lib/auth";
import { getCourses, getProduct, getResources } from "@/lib/content";
import { store } from "@/lib/store";

export const metadata: Metadata = { title: "My library", robots: { index: false, follow: false } };

export default async function Account({ searchParams }: { searchParams: Promise<{ checkout?: string }> }) {
  const session = await getSession();
  if (!session) redirect("/account/sign-in/?next=/account");
  const { checkout } = await searchParams;
  const owned = (await store().listEntitlements(session.email)).map((e) => getProduct(e.product)).filter((p) => p !== undefined);
  const freeCourses = getCourses().filter((c) => c.access !== "paid");
  const freeResources = getResources().filter((r) => r.access !== "paid");
  const courses = [...owned.filter((p) => p.kind === "course"), ...freeCourses];
  const resources = [...owned.filter((p) => p.kind === "resource"), ...freeResources];
  return <>
    <section className="hero"><div className="wrap">
      <p className="eyebrow">My library</p><h1 className="h-md">Welcome back.</h1>
      <div className="account-bar"><span>Signed in as <strong>{session.email}</strong></span><form action="/api/auth/sign-out/" method="post"><button type="submit" className="text-link">Sign out</button></form></div>
      {checkout === "failed" && <p className="form-status error" role="alert">We couldn’t confirm that payment. If you were charged, email hello@nexagen.ng with your receipt and we’ll sort it immediately.</p>}
    </div></section>
    <section className="section soft"><div className="wrap">
      <h2 className="h-sm">Courses</h2>
      {courses.length ? <div className="course-grid">{[...new Map(courses.map((c) => [c.slug, c])).values()].map((c) => <CourseCard key={c.slug} course={c as Parameters<typeof CourseCard>[0]["course"]} />)}</div> : <p className="empty">No courses yet. <Link href="/learn/">Browse the catalogue →</Link></p>}
      <h2 className="h-sm" style={{ marginTop: 80 }}>Resources</h2>
      {resources.length ? <div className="resource-grid">{[...new Map(resources.map((r) => [r.slug, r])).values()].map((r) => <ResourceCard key={r.slug} resource={r as Parameters<typeof ResourceCard>[0]["resource"]} />)}</div> : <p className="empty">No resources yet.</p>}
    </div></section>
  </>;
}
