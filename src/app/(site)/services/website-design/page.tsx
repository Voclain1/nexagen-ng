import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/site-shell";
import { JsonLd } from "@/components/seo";

const schema = {"@context": "https://schema.org", "@type": "Service", "name": "Website Design and Development", "description": "Modern website design and development for Nigerian businesses. Mobile-first, search-ready and built to convert visitors into enquiries.", "provider": {"@id": "https://nexagen.ng/#organization"}, "areaServed": {"@type": "Country", "name": "Nigeria"}, "url": "https://nexagen.ng/services/website-design/"};

export const metadata: Metadata = { title: { absolute: "Website Design Company in Nigeria | Nexagen" }, description: "Modern website design and development for Nigerian businesses. Mobile-first, search-ready and built to convert visitors into enquiries.", alternates: { canonical: "/services/website-design/" }, openGraph: { title: "Website Design Company in Nigeria | Nexagen", description: "Modern website design and development for Nigerian businesses. Mobile-first, search-ready and built to convert visitors into enquiries.", url: "/services/website-design/" } };

export default function Page() {
  return <>
<JsonLd data={schema} />
<section className="hero"><div className="wrap heroGrid"><div><span className="crumb">Website design and development</span><h1>A website that makes your business <span className="accent">easier to choose.</span></h1><p>Nexagen creates modern, fast and credible websites for Nigerian businesses that need more than an online brochure.</p><div className="heroActions"><Link className="button lime" href="/contact/">Request a website quote ↗</Link><Link className="button" href="/work/">View our work</Link></div></div><aside className="proofBox"><div><small>BUILT AROUND THE BUYER</small><strong>Clarity first.</strong><p>Strong messaging, useful structure and a direct route from interest to enquiry.</p></div><div className="miniGrid"><span className="mini">Mobile UX</span><span className="mini">Fast pages</span><span className="mini">SEO setup</span><span className="mini">Analytics</span></div></aside></div></section><section className="section soft"><div className="wrap"><div className="head"><div><span className="crumb">What is included</span><h2>A complete website foundation.</h2></div><p>The exact scope follows your requirements, but every build is planned as a coherent business experience.</p></div><div className="list"><div className="row"><b>01</b><b>Strategy and structure</b><p>Goals, audiences, sitemap, page priorities and content direction.</p></div><div className="row"><b>02</b><b>Interface design</b><p>A distinctive light, responsive interface designed around your brand.</p></div><div className="row"><b>03</b><b>Development</b><p>Accessible, performant implementation using the technology appropriate for the project.</p></div><div className="row"><b>04</b><b>Search foundations</b><p>Metadata, structured content, sitemap, technical checks and measurement.</p></div><div className="row"><b>05</b><b>Launch and handover</b><p>Testing, deployment, training and a practical plan for ongoing improvement.</p></div></div></div></section>

<CtaBand />
  </>;
}
