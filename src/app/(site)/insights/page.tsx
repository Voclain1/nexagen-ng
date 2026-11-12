import type { Metadata } from "next";
import { PostIndex } from "@/components/post-index";

export const revalidate = 3600; // picks up scheduled (future-dated) posts hourly

export const metadata: Metadata = {
  title: "Insights: guides on digital products, web engineering, SEO & AI",
  description: "Practical guides and tutorials from Nexagen on digital product development, Next.js engineering, technical SEO and applied AI automation.",
  alternates: { canonical: "/insights/", types: { "application/rss+xml": "/insights/feed.xml" } },
};

export default function Insights() { return <PostIndex page={1} />; }
