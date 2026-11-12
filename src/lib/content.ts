import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

/**
 * File-based content layer.
 *
 *   content/authors/*.json          people (E-E-A-T: bios, credentials, profiles)
 *   content/categories.json         blog categories with descriptions
 *   content/posts/*.mdx             articles  → /insights/[slug]
 *   content/videos/*.mdx            videos    → /videos/[slug]
 *   content/courses/<slug>/index.mdx + NN-lesson.mdx   → /learn/[course]/[lesson]
 *   content/resources/*.mdx (+ files/)                 → /learn/resources/[slug]
 *
 * Drafts (`draft: true`) and future-dated items are visible in development
 * and hidden in production unless SHOW_DRAFTS=1.
 */

const ROOT = path.join(process.cwd(), "content");
export const showDrafts = process.env.NODE_ENV !== "production" || process.env.SHOW_DRAFTS === "1";

/* ---------------------------------------------------------------- types */

export type Access = "free" | "email" | "paid";
export type Price = { amount: number; currency: "NGN" | "USD" };
export type VideoProvider = "youtube" | "mux" | "bunny" | "file";
export type VideoSource = { provider: VideoProvider; id: string; signed?: boolean; thumbnail?: string; duration?: number };
export type Faq = { q: string; a: string };
export type Heading = { depth: 2 | 3; text: string; id: string };

export type Author = { slug: string; name: string; role: string; bio: string; avatar?: string; url?: string; sameAs?: string[]; expertise?: string[]; organization?: boolean };
export type Category = { slug: string; name: string; description: string };

type Base = { slug: string; title: string; description: string; date: string; updated?: string; draft: boolean; body: string; headings: Heading[]; readingMinutes: number; cover?: string; coverAlt?: string };

export type Post = Base & { kind: "post"; author: string; category: string; tags: string[]; keyword?: string; featured: boolean; faq: Faq[]; video?: string; canonical?: string };
export type Video = Base & { kind: "video"; author: string; category?: string; tags: string[]; source: VideoSource; durationSeconds: number; chapters: { time: string; seconds: number; title: string }[]; transcript: boolean };
export type Lesson = Base & { kind: "lesson"; course: string; order: number; module: string; preview: boolean; video?: VideoSource; durationSeconds?: number; resources: string[] };
export type Course = Base & { kind: "course"; instructor: string; level: "Beginner" | "Intermediate" | "Advanced"; access: Access; price?: Price; outcomes: string[]; audience: string[]; lessons: Lesson[]; modules: { title: string; lessons: Lesson[] }[]; trailer?: VideoSource; productKey: string };
export type Resource = Base & { kind: "resource"; format: string; access: Access; price?: Price; file?: string; url?: string; author: string; productKey: string };

/* -------------------------------------------------------------- helpers */

class ContentError extends Error {
  constructor(file: string, message: string) { super(`[content] ${path.relative(process.cwd(), file)}: ${message}`); }
}

const read = (file: string) => matter(fs.readFileSync(file, "utf8"));
const listMdx = (dir: string) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /\.mdx?$/.test(f) && !f.startsWith("_")).sort() : []);
const slugOf = (file: string) => path.basename(file).replace(/\.mdx?$/, "").replace(/^\d+-/, "");

function str(data: Record<string, unknown>, key: string, file: string, required = true): string {
  const value = data[key];
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && value.trim()) return value.trim();
  if (required) throw new ContentError(file, `missing required frontmatter "${key}"`);
  return "";
}
const opt = (data: Record<string, unknown>, key: string, file: string) => str(data, key, file, false) || undefined;
const list = (value: unknown): string[] => (Array.isArray(value) ? value.map(String) : []);

function date(data: Record<string, unknown>, key: string, file: string, required = true) {
  const value = str(data, key, file, required);
  if (value && Number.isNaN(Date.parse(value))) throw new ContentError(file, `"${key}" must be a date (YYYY-MM-DD)`);
  return value;
}

/** "1:02:03" | "4:05" | 245 → seconds */
export function toSeconds(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value !== "string" || !value) return 0;
  return value.split(":").map(Number).reduce((total, part) => total * 60 + (part || 0), 0);
}

function access(data: Record<string, unknown>, file: string): { access: Access; price?: Price } {
  const value = (data.access ?? "free") as Access;
  if (!["free", "email", "paid"].includes(value)) throw new ContentError(file, `"access" must be free, email or paid`);
  if (value !== "paid") return { access: value };
  const price = data.price as Price | undefined;
  if (!price || typeof price.amount !== "number" || price.amount <= 0 || !["NGN", "USD"].includes(price.currency)) throw new ContentError(file, `paid items need "price: { amount: <number>, currency: NGN | USD }"`);
  return { access: value, price };
}

function videoSource(value: unknown, file: string): VideoSource | undefined {
  if (!value) return undefined;
  const v = value as Partial<VideoSource> & { duration?: unknown };
  if (!v.provider || !v.id) throw new ContentError(file, `video needs "provider" and "id"`);
  if (!["youtube", "mux", "bunny", "file"].includes(v.provider)) throw new ContentError(file, `unknown video provider "${v.provider}"`);
  return { provider: v.provider, id: String(v.id), signed: v.signed, thumbnail: v.thumbnail, duration: toSeconds(v.duration) || undefined };
}

/** Extract h2/h3 headings for the table of contents, using the same slugger as rehype-slug. */
export function extractHeadings(body: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let fenced = false;
  for (const line of body.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    if (fenced) continue;
    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const text = match[2].replace(/`([^`]+)`/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_]/g, "");
    const id = slugger.slug(text);
    if (match[1].length === 2 || match[1].length === 3) headings.push({ depth: match[1].length as 2 | 3, text, id });
  }
  return headings;
}

const readingMinutes = (body: string) => Math.max(1, Math.round(body.replace(/<[^>]+>|```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length / 230));

function base(file: string, slug: string, data: Record<string, unknown>, body: string): Base {
  return {
    slug,
    title: str(data, "title", file),
    description: str(data, "description", file),
    date: date(data, "date", file),
    updated: date(data, "updated", file, false) || undefined,
    draft: data.draft === true,
    body,
    headings: extractHeadings(body),
    readingMinutes: readingMinutes(body),
    cover: opt(data, "cover", file),
    coverAlt: opt(data, "coverAlt", file),
  };
}

const isLive = (item: { draft: boolean; date: string }) => showDrafts || (!item.draft && Date.parse(item.date) <= Date.now());
const newestFirst = <T extends { date: string }>(a: T, b: T) => Date.parse(b.date) - Date.parse(a.date);

/* ------------------------------------------------------------- loaders */

export const getAuthors = cache((): Author[] => {
  const dir = path.join(ROOT, "authors");
  return fs.readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => ({ slug: f.replace(/\.json$/, ""), ...JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) }));
});
export const getAuthor = (slug: string) => getAuthors().find((a) => a.slug === slug);

export const getCategories = cache((): Category[] => JSON.parse(fs.readFileSync(path.join(ROOT, "categories.json"), "utf8")));
export const getCategory = (slug: string) => getCategories().find((c) => c.slug === slug);

function assertAuthor(slug: string, file: string) {
  if (!getAuthor(slug)) throw new ContentError(file, `unknown author "${slug}" (add content/authors/${slug}.json)`);
  return slug;
}

const loadPosts = cache((): Post[] => {
  const dir = path.join(ROOT, "posts");
  return listMdx(dir).map((name) => {
    const file = path.join(dir, name);
    const { data, content } = read(file);
    const category = str(data, "category", file);
    if (!getCategory(category)) throw new ContentError(file, `unknown category "${category}" (see content/categories.json)`);
    return {
      kind: "post" as const,
      ...base(file, slugOf(name), data, content),
      author: assertAuthor(str(data, "author", file), file),
      category,
      tags: list(data.tags),
      keyword: opt(data, "keyword", file),
      featured: data.featured === true,
      faq: Array.isArray(data.faq) ? (data.faq as Faq[]) : [],
      video: opt(data, "video", file),
      canonical: opt(data, "canonical", file),
    };
  });
});

export const getPosts = cache(() => loadPosts().filter(isLive).sort(newestFirst));
export const getPost = (slug: string) => getPosts().find((p) => p.slug === slug);
export const getPostsByCategory = (category: string) => getPosts().filter((p) => p.category === category);
export const getPostsByAuthor = (author: string) => getPosts().filter((p) => p.author === author);

/** Related posts: same category first, then shared tags, then recency. */
export function getRelatedPosts(post: Post, limit = 3) {
  return getPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, score: (p.category === post.category ? 3 : 0) + p.tags.filter((t) => post.tags.includes(t)).length }))
    .sort((a, b) => b.score - a.score || newestFirst(a.p, b.p))
    .slice(0, limit)
    .map(({ p }) => p);
}

const loadVideos = cache((): Video[] => {
  const dir = path.join(ROOT, "videos");
  return listMdx(dir).map((name) => {
    const file = path.join(dir, name);
    const { data, content } = read(file);
    const source = videoSource(data.video, file);
    if (!source) throw new ContentError(file, `videos need a "video: { provider, id }" block`);
    const chapters = Array.isArray(data.chapters) ? (data.chapters as { time: string; title: string }[]).map((c) => ({ time: String(c.time), seconds: toSeconds(String(c.time)), title: c.title })) : [];
    return {
      kind: "video" as const,
      ...base(file, slugOf(name), data, content),
      author: assertAuthor(str(data, "author", file), file),
      category: opt(data, "category", file),
      tags: list(data.tags),
      source,
      durationSeconds: source.duration ?? toSeconds(data.duration),
      chapters,
      transcript: data.transcript === true,
    };
  });
});
export const getVideos = cache(() => loadVideos().filter(isLive).sort(newestFirst));
export const getVideo = (slug: string) => getVideos().find((v) => v.slug === slug);

const loadCourses = cache((): Course[] => {
  const dir = path.join(ROOT, "courses");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((d) => !d.startsWith("_") && fs.statSync(path.join(dir, d)).isDirectory()).map((slug) => {
    const courseDir = path.join(dir, slug);
    const file = path.join(courseDir, "index.mdx");
    if (!fs.existsSync(file)) throw new ContentError(courseDir, "course folders need an index.mdx");
    const { data, content } = read(file);
    const lessons: Lesson[] = listMdx(courseDir).filter((n) => n !== "index.mdx").map((name, index) => {
      const lessonFile = path.join(courseDir, name);
      const lesson = read(lessonFile);
      const video = videoSource(lesson.data.video, lessonFile);
      return {
        kind: "lesson" as const,
        ...base(lessonFile, slugOf(name), { date: data.date, ...lesson.data }, lesson.content),
        course: slug,
        order: index + 1,
        module: opt(lesson.data, "module", lessonFile) ?? "Lessons",
        preview: lesson.data.preview === true,
        video,
        durationSeconds: video?.duration ?? (toSeconds(lesson.data.duration) || undefined),
        resources: list(lesson.data.resources),
      };
    });
    const modules: Course["modules"] = [];
    for (const lesson of lessons) {
      const current = modules.at(-1);
      if (current?.title === lesson.module) current.lessons.push(lesson);
      else modules.push({ title: lesson.module, lessons: [lesson] });
    }
    const level = (data.level ?? "Beginner") as Course["level"];
    return {
      kind: "course" as const,
      ...base(file, slug, data, content),
      ...access(data, file),
      instructor: assertAuthor(str(data, "instructor", file), file),
      level,
      outcomes: list(data.outcomes),
      audience: list(data.audience),
      lessons,
      modules,
      trailer: videoSource(data.trailer, file),
      productKey: `course:${slug}`,
    };
  });
});
export const getCourses = cache(() => loadCourses().filter(isLive).sort(newestFirst));
export const getCourse = (slug: string) => getCourses().find((c) => c.slug === slug);

const loadResources = cache((): Resource[] => {
  const dir = path.join(ROOT, "resources");
  return listMdx(dir).map((name) => {
    const file = path.join(dir, name);
    const { data, content } = read(file);
    const resource = {
      kind: "resource" as const,
      ...base(file, slugOf(name), data, content),
      ...access(data, file),
      format: opt(data, "format", file) ?? "Download",
      file: opt(data, "file", file),
      url: opt(data, "url", file),
      author: assertAuthor(str(data, "author", file), file),
      productKey: `resource:${slugOf(name)}`,
    };
    if (!resource.file && !resource.url) throw new ContentError(file, `resources need "file" (in content/resources/files/) or "url"`);
    return resource;
  });
});
export const getResources = cache(() => loadResources().filter(isLive).sort(newestFirst));
export const getResource = (slug: string) => getResources().find((r) => r.slug === slug);
export const resourceFilePath = (resource: Resource) => (resource.file ? path.join(ROOT, "resources", "files", path.basename(resource.file)) : undefined);

/** Every purchasable/gated product, keyed by productKey. */
export function getProduct(key: string): Course | Resource | undefined {
  const [type, slug] = key.split(":");
  return type === "course" ? getCourse(slug) : type === "resource" ? getResource(slug) : undefined;
}

/* ------------------------------------------------------------- format */

export const formatDate = (value: string) => new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
export const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60), s = Math.floor(seconds % 60);
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
};
export const isoDuration = (seconds: number) => `PT${Math.floor(seconds / 3600) ? `${Math.floor(seconds / 3600)}H` : ""}${Math.floor((seconds % 3600) / 60)}M${Math.floor(seconds % 60)}S`;
export const formatPrice = (price: Price) => new Intl.NumberFormat(price.currency === "NGN" ? "en-NG" : "en-US", { style: "currency", currency: price.currency, maximumFractionDigits: 0 }).format(price.amount);
