import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/site-shell";
import { JsonLd } from "@/components/seo";

const schema = {"@context": "https://schema.org", "@type": "ProfessionalService", "@id": "https://nexagen.ng/web-design-company-lagos/#service", "name": "Nexagen Digital — Web Design Company in Lagos", "url": "https://nexagen.ng/web-design-company-lagos/", "telephone": "+2349067084003", "email": "hello@nexagen.ng", "parentOrganization": {"@id": "https://nexagen.ng/#organization"}, "areaServed": {"@type": "City", "name": "Lagos"}, "address": {"@type": "PostalAddress", "addressLocality": "Lagos", "addressRegion": "Lagos", "addressCountry": "NG"}, "serviceType": ["Website Design", "Web Development", "Custom Web Applications", "SEO"]};

export const metadata: Metadata = { title: { absolute: "Web Design Company in Lagos, Nigeria | Nexagen" }, description: "Nexagen designs modern business websites and custom web platforms for companies in Lagos, Nigeria.", alternates: { canonical: "/web-design-company-lagos/" }, openGraph: { title: "Web Design Company in Lagos, Nigeria | Nexagen", description: "Nexagen designs modern business websites and custom web platforms for companies in Lagos, Nigeria.", url: "/web-design-company-lagos/" } };

export default function Page() {
  return <>
<JsonLd data={schema} />
<section className="hero"><div className="wrap heroGrid"><div><span className="crumb">Web design company in Lagos</span><h1>Modern websites for businesses moving <span className="accent">Lagos forward.</span></h1><p>Nexagen designs fast, credible websites and digital platforms for Lagos businesses that need stronger customer acquisition and better digital operations.</p><div className="heroActions"><Link className="button lime" href="/contact/">Request a Lagos website quote ↗</Link><Link className="button" href="/work/">View recent work</Link></div></div><aside className="proofBox"><div><small>NIGERIA-FIRST DELIVERY</small><strong>Local context.</strong><p>Mobile-first design, familiar payment flows, direct communication and infrastructure choices suited to the market.</p></div></aside></div></section><section className="section soft"><div className="wrap"><div className="head"><div><span className="crumb">Lagos web-development services</span><h2>Built for trust, speed and action.</h2></div><p>From professional company websites to operational platforms, every project begins with the business outcome.</p></div><div className="grid3"><article className="card"><small>BUSINESS WEBSITES</small><h3>Win customer confidence</h3><p>Present your services clearly and make it easy to enquire on any device.</p></article><article className="card"><small>E-COMMERCE</small><h3>Sell with less friction</h3><p>Product discovery, payments, delivery information and post-purchase communication.</p></article><article className="card"><small>CUSTOM PLATFORMS</small><h3>Improve how work flows</h3><p>Portals, dashboards, marketplaces and internal systems built around your operation.</p></article></div></div></section>

<CtaBand />
  </>;
}
