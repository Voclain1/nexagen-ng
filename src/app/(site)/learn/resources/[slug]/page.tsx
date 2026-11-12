import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthorBox } from "@/components/content-ui";
import { AccessPanel } from "@/components/paywall";
import { Breadcrumbs, JsonLd } from "@/components/seo";
import { CtaBand } from "@/components/site-shell";
import { checkAccess } from "@/lib/access";
import { getResource } from "@/lib/content";
import { MDXContent } from "@/lib/mdx";
import { resourceSchema } from "@/lib/schema";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resource = getResource((await params).slug);
  return resource ? { title: `${resource.title} (${resource.access === "paid" ? "template" : "free download"})`, description: resource.description, alternates: { canonical: `/learn/resources/${resource.slug}/` }, robots: resource.draft ? { index: false, follow: false } : undefined } : {};
}

export default async function ResourcePage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ checkout?: string; purchased?: string }> }) {
  const resource = getResource((await params).slug);
  if (!resource) notFound();
  const query = await searchParams;
  const state = await checkAccess(resource);
  return <>
    <JsonLd data={resourceSchema(resource)} />
    <section className="hero"><div className="wrap">
      <Breadcrumbs items={[{ name: "Learn", path: "/learn/" }, { name: resource.title, path: `/learn/resources/${resource.slug}/` }]} />
      <div className="course-hero-grid light">
        <div><p className="eyebrow">{resource.format}{resource.draft && <span className="badge draft">Draft</span>}</p><h1 className="h-md">{resource.title}</h1><p className="course-lead">{resource.description}</p></div>
        <AccessPanel product={resource} state={state} startHref={`/api/resources/${resource.slug}/`} checkout={query.checkout} purchased={query.purchased === "1"} />
      </div>
    </div></section>
    <section className="section soft"><div className="wrap course-body"><div><div className="prose"><MDXContent source={resource.body} /></div><AuthorBox slug={resource.author} label="Created by" /></div></div></section>
    <CtaBand />
  </>;
}
