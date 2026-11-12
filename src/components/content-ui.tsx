import Image from "next/image";
import Link from "next/link";
import { absoluteUrl } from "@/lib/config";
import { formatDate, formatDuration, formatPrice, getAuthor, getCategory, type Course, type Heading, type Post, type Resource, type Video } from "@/lib/content";
import { thumbnailFor } from "@/lib/video";
import { NewsletterForm } from "./forms";
import { Arrow } from "./site-shell";

const Draft = ({ draft }: { draft: boolean }) => (draft ? <span className="badge draft">Draft</span> : null);

/** Generated cover art used when a post has no cover image: consistent, brand-safe, zero bytes. */
function CoverArt({ seed, label }: { seed: string; label: string }) {
  const variant = [...seed].reduce((n, c) => n + c.charCodeAt(0), 0) % 4;
  return <div className={`cover-art art-v${variant}`} aria-hidden="true"><span>{label}</span></div>;
}

export function PostCard({ post, large = false }: { post: Post; large?: boolean }) {
  const category = getCategory(post.category);
  return <article className={`post-card${large ? " large" : ""}`}>
    <Link href={`/insights/${post.slug}/`} className="post-card-media" tabIndex={-1} aria-hidden="true">
      {post.cover ? <Image src={post.cover} alt="" fill sizes={large ? "(max-width: 900px) 100vw, 60vw" : "(max-width: 900px) 100vw, 33vw"} /> : <CoverArt seed={post.slug} label={category?.name ?? ""} />}
    </Link>
    <div className="post-card-body">
      <p className="eyebrow"><Link href={`/insights/category/${post.category}/`}>{category?.name}</Link> <Draft draft={post.draft} /></p>
      <h3><Link href={`/insights/${post.slug}/`}>{post.title}</Link></h3>
      {large && <p className="post-card-excerpt">{post.description}</p>}
      <small><time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min read</small>
    </div>
  </article>;
}

export function VideoCard({ video }: { video: Video }) {
  const thumb = thumbnailFor(video.source);
  return <article className="video-card">
    <Link href={`/videos/${video.slug}/`} className="video-card-media">
      {/* eslint-disable-next-line @next/next/no-img-element -- remote provider thumbnail */}
      {thumb ? <img src={thumb} alt="" loading="lazy" decoding="async" /> : <CoverArt seed={video.slug} label="Video" />}
      <span className="video-play small" aria-hidden="true">▶</span>
      {video.durationSeconds > 0 && <span className="duration">{formatDuration(video.durationSeconds)}</span>}
    </Link>
    <p className="eyebrow">{video.category ? getCategory(video.category)?.name : "Video"} <Draft draft={video.draft} /></p>
    <h3><Link href={`/videos/${video.slug}/`}>{video.title}</Link></h3>
  </article>;
}

export function AccessBadge({ item }: { item: Course | Resource }) {
  if (item.access === "paid" && item.price) return <span className="badge paid">{formatPrice(item.price)}</span>;
  return <span className="badge free">{item.access === "email" ? "Free · email" : "Free"}</span>;
}

export function CourseCard({ course }: { course: Course }) {
  const minutes = Math.round(course.lessons.reduce((t, l) => t + (l.durationSeconds ?? 0), 0) / 60);
  return <Link href={`/learn/${course.slug}/`} className="course-card">
    <div className="course-card-media">{course.cover ? <Image src={course.cover} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" /> : <CoverArt seed={course.slug} label="Course" />}</div>
    <div className="course-card-body">
      <p className="eyebrow">{course.level} · {course.lessons.length} lessons{minutes ? ` · ${minutes} min` : ""} <Draft draft={course.draft} /></p>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <div className="course-card-foot"><AccessBadge item={course} /><span className="round-arrow"><Arrow diagonal /></span></div>
    </div>
  </Link>;
}

export function ResourceCard({ resource }: { resource: Resource }) {
  return <Link href={`/learn/resources/${resource.slug}/`} className="resource-card">
    <p className="eyebrow">{resource.format} <Draft draft={resource.draft} /></p>
    <h3>{resource.title}</h3>
    <p>{resource.description}</p>
    <div className="course-card-foot"><AccessBadge item={resource} /><Arrow diagonal /></div>
  </Link>;
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null;
  return <nav className="toc" aria-label="Table of contents"><p className="eyebrow">On this page</p><ol>{headings.map((h) => <li key={h.id} className={h.depth === 3 ? "sub" : undefined}><a href={`#${h.id}`}>{h.text}</a></li>)}</ol></nav>;
}

export function AuthorBox({ slug, label = "Written by" }: { slug: string; label?: string }) {
  const author = getAuthor(slug);
  if (!author) return null;
  return <aside className="author-box">
    {author.avatar ? <Image src={author.avatar} alt={author.name} width={72} height={72} /> : <span className="author-initial" aria-hidden="true">{author.name[0]}</span>}
    <div><p className="eyebrow">{label}</p><p className="author-name">{author.organization ? author.name : <Link href={`/authors/${author.slug}/`}>{author.name}</Link>}</p><p className="author-role">{author.role}</p><p>{author.bio}</p></div>
  </aside>;
}

export function ShareLinks({ path, title }: { path: string; title: string }) {
  const url = encodeURIComponent(absoluteUrl(path));
  const text = encodeURIComponent(title);
  return <div className="share"><span className="eyebrow">Share</span>
    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`} target="_blank" rel="noopener">LinkedIn</a>
    <a href={`https://x.com/intent/post?url=${url}&text=${text}`} target="_blank" rel="noopener">X</a>
    <a href={`https://wa.me/?text=${text}%20${url}`} target="_blank" rel="noopener">WhatsApp</a>
    <a href={`mailto:?subject=${text}&body=${url}`}>Email</a>
  </div>;
}

export function NewsletterBand({ source, title = "Get the next guide in your inbox." }: { source: string; title?: string }) {
  return <section className="newsletter-band"><div className="wrap newsletter-grid"><div><p className="eyebrow">Nexagen insights by email</p><h2>{title}</h2><p>Practical, Nigeria-first guidance on websites, online stores, SEO and business technology. Roughly twice a month. No spam.</p></div><NewsletterForm source={source} /></div></section>;
}

export function Pagination({ page, pages, base }: { page: number; pages: number; base: string }) {
  if (pages < 2) return null;
  const href = (n: number) => (n === 1 ? base : `${base}page/${n}/`);
  return <nav className="pagination" aria-label="Pagination">
    {page > 1 ? <Link href={href(page - 1)} rel="prev">← Newer</Link> : <span />}
    <span>Page {page} of {pages}</span>
    {page < pages ? <Link href={href(page + 1)} rel="next">Older →</Link> : <span />}
  </nav>;
}
