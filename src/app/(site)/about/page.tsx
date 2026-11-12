import type { Metadata } from "next";
import { CtaBand } from "@/components/site-shell";

export const metadata: Metadata = { title: { absolute: "About Nexagen Digital Nigeria" }, description: "Nexagen is a Nigerian digital product agency designing websites and platforms that help businesses operate and grow.", alternates: { canonical: "/about/" }, openGraph: { title: "About Nexagen Digital Nigeria", description: "Nexagen is a Nigerian digital product agency designing websites and platforms that help businesses operate and grow.", url: "/about/" } };

export default function Page() {
  return <>
<section className="hero"><div className="wrap heroGrid"><div><span className="crumb">About Nexagen</span><h1>Built in Nigeria. Designed for <span className="accent">serious progress.</span></h1><p>Nexagen is a digital product agency helping businesses turn ideas, workflows and opportunities into useful websites and technology.</p></div><aside className="proofBox"><div><small>OUR OPERATING IDEA</small><strong>Make it useful.</strong><p>Good design should clarify value, reduce friction and help the business move.</p></div><div className="miniGrid"><span className="mini">40+ websites</span><span className="mini">4+ years</span><span className="mini">Product thinking</span><span className="mini">Full-stack delivery</span></div></aside></div></section><section className="section soft"><div className="wrap"><div className="head"><div><span className="crumb">How we think</span><h2>Technology follows the business problem.</h2></div><p>We do not force every client into one stack, template or oversized solution.</p></div><div className="grid3"><article className="card"><small>01</small><h3>Start with clarity</h3><p>Understand the user, commercial goal and operational reality before choosing features.</p></article><article className="card"><small>02</small><h3>Build for the context</h3><p>Design for real devices, connections, payment behaviour and customer expectations.</p></article><article className="card"><small>03</small><h3>Improve with evidence</h3><p>Launch a complete foundation, measure meaningful actions and prioritise what matters next.</p></article></div></div></section>

<CtaBand />
  </>;
}
