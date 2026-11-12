import Link from "next/link";
import { breadcrumbSchema } from "@/lib/schema";

/** Safely serialises JSON-LD (escapes "<" so content can never close the script tag). */
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** Visible breadcrumb trail + matching BreadcrumbList schema. */
export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const trail = [{ name: "Home", path: "/" }, ...items];
  return <>
    <JsonLd data={breadcrumbSchema(trail)} />
    <nav aria-label="Breadcrumb" className="breadcrumbs"><ol>{trail.map((item, index) => <li key={item.path}>{index === trail.length - 1 ? <span aria-current="page">{item.name}</span> : <Link href={item.path}>{item.name}</Link>}</li>)}</ol></nav>
  </>;
}
