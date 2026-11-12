import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { PostIndex, pageCount } from "@/components/post-index";

export const revalidate = 3600;
export function generateStaticParams() { return Array.from({ length: Math.max(0, pageCount() - 1) }, (_, i) => ({ page: String(i + 2) })); }

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  return { title: `Insights — page ${page}`, alternates: { canonical: `/insights/page/${page}/` } };
}

export default async function InsightsPage({ params }: { params: Promise<{ page: string }> }) {
  const page = Number((await params).page);
  if (page === 1) permanentRedirect("/insights/");
  if (!Number.isInteger(page) || page < 1 || page > pageCount()) notFound();
  return <PostIndex page={page} />;
}
