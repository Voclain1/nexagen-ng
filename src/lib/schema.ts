import { absoluteUrl, siteConfig } from "./config";
import { getAuthor, isoDuration, type Course, type Post, type Resource, type Video } from "./content";
import { publicEmbedUrl, thumbnailFor } from "./video";

/** schema.org JSON-LD builders. Rendered with <JsonLd data={…} />. */

const orgId = `${siteConfig.url}/#organization`;

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": orgId,
  name: siteConfig.legalName,
  alternateName: siteConfig.name,
  url: siteConfig.url,
  logo: absoluteUrl(siteConfig.logo),
  image: absoluteUrl(siteConfig.logo),
  description: siteConfig.description,
  email: siteConfig.email.hello,
  telephone: siteConfig.phone,
  sameAs: siteConfig.sameAs.length ? siteConfig.sameAs : undefined,
  areaServed: { "@type": "Country", name: "Nigeria" },
  address: { "@type": "PostalAddress", addressLocality: siteConfig.address.locality, addressRegion: siteConfig.address.region, addressCountry: siteConfig.address.country },
  contactPoint: { "@type": "ContactPoint", telephone: siteConfig.phone, contactType: "sales", areaServed: "NG", availableLanguage: ["en"] },
});

export const websiteSchema = () => ({ "@context": "https://schema.org", "@type": "WebSite", "@id": `${siteConfig.url}/#website`, url: siteConfig.url, name: siteConfig.name, publisher: { "@id": orgId }, inLanguage: "en-NG" });

export function personSchema(slug: string) {
  const author = getAuthor(slug);
  if (!author) return { "@id": orgId };
  if (author.organization) return { "@type": "Organization", "@id": orgId, name: author.name, url: siteConfig.url };
  return { "@type": "Person", "@id": absoluteUrl(`/authors/${author.slug}/#person`), name: author.name, jobTitle: author.role, description: author.bio, url: absoluteUrl(`/authors/${author.slug}/`), image: author.avatar ? absoluteUrl(author.avatar) : undefined, sameAs: author.sameAs, knowsAbout: author.expertise, worksFor: { "@id": orgId } };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: absoluteUrl(item.path) })) };
}

export function articleSchema(post: Post) {
  const url = absoluteUrl(`/insights/${post.slug}/`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    headline: post.title,
    description: post.description,
    image: absoluteUrl(post.cover ?? `/insights/${post.slug}/opengraph-image`),
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: personSchema(post.author),
    publisher: { "@id": orgId },
    articleSection: post.category,
    keywords: [post.keyword, ...post.tags].filter(Boolean).join(", "),
    wordCount: post.body.split(/\s+/).length,
    inLanguage: "en-NG",
  };
}

export function faqSchema(faq: { q: string; a: string }[]) {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) };
}

export function videoSchema(video: Video) {
  const url = absoluteUrl(`/videos/${video.slug}/`);
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${url}#video`,
    name: video.title,
    description: video.description,
    thumbnailUrl: [thumbnailFor(video.source) ?? absoluteUrl(`/videos/${video.slug}/opengraph-image`)],
    uploadDate: video.date,
    duration: video.durationSeconds ? isoDuration(video.durationSeconds) : undefined,
    embedUrl: publicEmbedUrl(video.source),
    contentUrl: video.source.provider === "file" ? absoluteUrl(video.source.id) : undefined,
    publisher: { "@id": orgId },
    author: personSchema(video.author),
    hasPart: video.chapters.length ? video.chapters.map((chapter, index) => ({ "@type": "Clip", name: chapter.title, startOffset: chapter.seconds, endOffset: video.chapters[index + 1]?.seconds ?? video.durationSeconds, url: `${url}?t=${chapter.seconds}` })) : undefined,
  };
}

export function courseSchema(course: Course) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": absoluteUrl(`/learn/${course.slug}/#course`),
    name: course.title,
    description: course.description,
    provider: { "@id": orgId, "@type": "Organization", name: siteConfig.legalName, sameAs: siteConfig.url },
    educationalLevel: course.level,
    teaches: course.outcomes,
    inLanguage: "en-NG",
    isAccessibleForFree: course.access !== "paid",
    offers: { "@type": "Offer", category: course.access === "paid" ? "Paid" : "Free", price: course.price?.amount ?? 0, priceCurrency: course.price?.currency ?? "NGN", url: absoluteUrl(`/learn/${course.slug}/`), availability: "https://schema.org/InStock" },
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "Online", courseWorkload: `PT${Math.max(1, Math.round(course.lessons.reduce((t, l) => t + (l.durationSeconds ?? 600), 0) / 3600))}H`, instructor: personSchema(course.instructor) },
  };
}

export function resourceSchema(resource: Resource) {
  return {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: resource.title,
    description: resource.description,
    url: absoluteUrl(`/learn/resources/${resource.slug}/`),
    author: personSchema(resource.author),
    publisher: { "@id": orgId },
    datePublished: resource.date,
    isAccessibleForFree: resource.access !== "paid",
    offers: resource.price ? { "@type": "Offer", price: resource.price.amount, priceCurrency: resource.price.currency } : undefined,
  };
}

export function itemListSchema(items: { url: string; name: string }[]) {
  return { "@context": "https://schema.org", "@type": "ItemList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, url: absoluteUrl(item.url), name: item.name })) };
}
