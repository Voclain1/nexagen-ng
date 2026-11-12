import { getCourse, getCourses } from "@/lib/content";
import { renderOg, ogSize } from "@/lib/og";

export const alt = "Nexagen course";
export const size = ogSize;
export const contentType = "image/png";
export function generateStaticParams() { return getCourses().map((c) => ({ course: c.slug })); }
export default async function Image({ params }: { params: Promise<{ course: string }> }) {
  const course = getCourse((await params).course);
  return renderOg({ eyebrow: `Course · ${course?.level ?? ""}`, title: course?.title ?? "Nexagen Learn", footer: course ? `${course.lessons.length} lessons · nexagen.ng/learn` : undefined });
}
