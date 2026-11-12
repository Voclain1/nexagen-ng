import type { MetadataRoute } from "next";
import { pageCount } from "@/components/post-index";
import { absoluteUrl } from "@/lib/config";
import { getAuthors, getCategories, getCourses, getPosts, getPostsByAuthor, getPostsByCategory, getResources, getVideos } from "@/lib/content";
import { publicEmbedUrl, thumbnailFor } from "@/lib/video";

export const revalidate = 3600;

/** Only canonical, indexable, published URLs (all with trailing slashes, like the live site). */
export default function sitemap(): MetadataRoute.Sitemap {
  const published = <T extends { draft: boolean }>(items: T[]) => items.filter((i) => !i.draft);
  const posts = published(getPosts());
  const newest = (items: { date: string; updated?: string }[]) => items.map((i) => i.updated ?? i.date).sort().at(-1);
  const page = (path: string, lastModified?: string, extra: Partial<MetadataRoute.Sitemap[number]> = {}) => ({ url: absoluteUrl(path), ...(lastModified ? { lastModified } : {}), ...extra });

  return [
    ...["/", "/services/", "/services/website-design/", "/services/custom-platforms/", "/web-design-company-lagos/", "/work/", "/about/", "/contact/"].map((p) => page(p)),
    page("/insights/", newest(posts)),
    ...Array.from({ length: pageCount() - 1 }, (_, i) => page(`/insights/page/${i + 2}/`)),
    ...getCategories().filter((c) => published(getPostsByCategory(c.slug)).length).map((c) => page(`/insights/category/${c.slug}/`, newest(getPostsByCategory(c.slug)))),
    ...posts.map((p) => page(p.canonical ?? `/insights/${p.slug}/`, p.updated ?? p.date, p.cover ? { images: [absoluteUrl(p.cover)] } : {})),
    ...getAuthors().filter((a) => !a.organization && getPostsByAuthor(a.slug).length).map((a) => page(`/authors/${a.slug}/`)),
    ...(published(getVideos()).length ? [page("/videos/", newest(published(getVideos())))] : []),
    ...published(getVideos()).map((v) => {
      const thumbnail = thumbnailFor(v.source);
      const player = publicEmbedUrl(v.source);
      return page(`/videos/${v.slug}/`, v.updated ?? v.date, thumbnail ? { videos: [{ title: v.title, description: v.description, thumbnail_loc: absoluteUrl(thumbnail), ...(player ? { player_loc: player } : { content_loc: absoluteUrl(v.source.id) }), ...(v.durationSeconds ? { duration: v.durationSeconds } : {}), publication_date: v.date }] } : {});
    }),
    ...(published([...getCourses(), ...getResources()]).length ? [page("/learn/", newest([...published(getCourses()), ...published(getResources())]))] : []),
    ...published(getCourses()).flatMap((c) => [page(`/learn/${c.slug}/`, c.updated ?? c.date), ...c.lessons.filter((l) => l.preview || c.access === "free").map((l) => page(`/learn/${c.slug}/${l.slug}/`, l.updated ?? c.date))]),
    ...published(getResources()).map((r) => page(`/learn/resources/${r.slug}/`, r.updated ?? r.date)),
  ];
}
