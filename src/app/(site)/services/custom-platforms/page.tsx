import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/site-shell";
import { JsonLd } from "@/components/seo";

const schema = {"@context": "https://schema.org", "@type": "Service", "name": "Custom Web Application Development", "description": "Custom portals, SaaS products, marketplaces and workflow platforms designed and developed for Nigerian businesses.", "provider": {"@id": "https://nexagen.ng/#organization"}, "areaServed": {"@type": "Country", "name": "Nigeria"}, "url": "https://nexagen.ng/services/custom-platforms/"};

export const metadata: Metadata = { title: { absolute: "Custom Web Application Development Nigeria | Nexagen" }, description: "Custom portals, SaaS products, marketplaces and workflow platforms designed and developed for Nigerian businesses.", alternates: { canonical: "/services/custom-platforms/" }, openGraph: { title: "Custom Web Application Development Nigeria | Nexagen", description: "Custom portals, SaaS products, marketplaces and workflow platforms designed and developed for Nigerian businesses.", url: "/services/custom-platforms/" } };

export default function Page() {
  return <>
<JsonLd data={schema} />
<section className="hero"><div className="wrap"><span className="crumb">Custom platforms</span><h1>Software shaped around <span className="accent">how the work happens.</span></h1><p>We turn operational problems and product ideas into portals, marketplaces, dashboards and SaaS products people can actually use.</p><div className="heroActions"><Link className="button lime" href="/contact/">Discuss your platform ↗</Link><Link className="button" href="/work/">See product work</Link></div></div></section><section className="section soft"><div className="wrap"><div className="head"><div><span className="crumb">Platform capabilities</span><h2>From workflow to working product.</h2></div><p>We combine product thinking, interface design and full-stack engineering.</p></div><div className="grid3"><article className="card"><small>PORTALS</small><h3>Customer and staff portals</h3><p>Secure role-based experiences for records, actions, communication and reporting.</p></article><article className="card"><small>MARKETPLACES</small><h3>Multi-user platforms</h3><p>Profiles, listings, search, requests, transactions and administrative workflows.</p></article><article className="card"><small>SAAS</small><h3>Subscription products</h3><p>Multi-tenant applications, onboarding, billing and scalable product foundations.</p></article></div></div></section>

<CtaBand />
  </>;
}
