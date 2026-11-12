import { formatDuration, getVideo, getVideos } from "@/lib/content";
import { renderOg, ogSize } from "@/lib/og";

export const alt = "Nexagen video tutorial";
export const size = ogSize;
export const contentType = "image/png";
export function generateStaticParams() { return getVideos().map((v) => ({ slug: v.slug })); }
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const video = getVideo((await params).slug);
  return renderOg({ eyebrow: "Video guide", title: video?.title ?? "Nexagen videos", footer: video?.durationSeconds ? `${formatDuration(video.durationSeconds)} · nexagen.ng/videos` : undefined });
}
