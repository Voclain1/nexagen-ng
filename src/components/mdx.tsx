import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { getVideo, type VideoProvider } from "@/lib/content";
import { VideoPlayer } from "./video-player";

/**
 * Components available in every MDX file without importing.
 * See content/README.md for authoring examples.
 */

function A({ href = "", ...props }: ComponentProps<"a">) {
  if (href.startsWith("/") || href.startsWith("#")) return <Link href={href} {...props} />;
  return <a href={href} target="_blank" rel="noopener" {...props} />;
}

function Img({ src, alt = "" }: ComponentProps<"img">) {
  // eslint-disable-next-line @next/next/no-img-element -- markdown images have unknown dimensions; use <Figure> for optimised images
  return <img src={typeof src === "string" ? src : undefined} alt={alt} loading="lazy" decoding="async" />;
}

const Table = (props: ComponentProps<"table">) => <div className="table-scroll"><table {...props} /></div>;

/** <Callout type="tip" title="Optional">…</Callout> — tip | note | warning */
export function Callout({ type = "note", title, children }: { type?: "tip" | "note" | "warning"; title?: string; children: ReactNode }) {
  return <aside className={`callout callout-${type}`} role="note"><strong>{title ?? { tip: "Tip", note: "Note", warning: "Watch out" }[type]}</strong><div>{children}</div></aside>;
}

/** <KeyTakeaways>- point one\n- point two</KeyTakeaways> — summary box, good for skimmers and AI overviews. */
export function KeyTakeaways({ children, title = "Key takeaways" }: { children: ReactNode; title?: string }) {
  return <aside className="takeaways"><p className="eyebrow">{title}</p>{children}</aside>;
}

/**
 * <Video slug="my-video" />                     embed a video from content/videos
 * <Video provider="youtube" id="dQw4w9WgXcQ" title="…" />   embed any public video
 */
export function Video({ slug, provider, id, title = "Video" }: { slug?: string; provider?: VideoProvider; id?: string; title?: string }) {
  if (slug) {
    const video = getVideo(slug);
    if (!video) return null;
    return <figure className="mdx-video"><VideoPlayer source={video.source} title={video.title} /><figcaption><Link href={`/videos/${video.slug}/`}>{video.title}</Link> — notes, chapters and transcript ↗</figcaption></figure>;
  }
  if (!provider || !id) return null;
  return <figure className="mdx-video"><VideoPlayer source={{ provider, id }} title={title} /></figure>;
}
export const YouTube = ({ id, title }: { id: string; title?: string }) => <Video provider="youtube" id={id} title={title} />;

/** <Figure src="/blog/x.png" alt="…" width={1600} height={900} caption="…" /> — optimised image */
export function Figure({ src, alt, width, height, caption }: { src: string; alt: string; width: number; height: number; caption?: string }) {
  return <figure className="mdx-figure"><Image src={src} alt={alt} width={width} height={height} sizes="(max-width: 820px) 100vw, 780px" />{caption && <figcaption>{caption}</figcaption>}</figure>;
}

/** <Cta href="/contact/" title="…">body</Cta> — mid-article conversion block */
export function Cta({ href, title, label = "Talk to us", children }: { href: string; title: string; label?: string; children?: ReactNode }) {
  return <aside className="mdx-cta"><div><strong>{title}</strong>{children}</div><A href={href} className="button dark">{label} ↗</A></aside>;
}

export const mdxComponents = { a: A, img: Img, table: Table, Callout, KeyTakeaways, Video, YouTube, Figure, Cta };
