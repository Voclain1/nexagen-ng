import type { Metadata } from "next";
import { ContactForm } from "@/components/forms";
import { PageIntro } from "@/components/site-shell";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: { absolute: "Start a Project with Nexagen" }, description: "Tell Nexagen about your website, e-commerce or custom platform project and request a focused consultation.", alternates: { canonical: "/contact/" } };

export default function Contact() {
  return <>
    <PageIntro eyebrow="Start a project" title="Tell us what you want to" accent="move forward." lead="You do not need a perfect brief. Share the business goal, current challenge and what you believe the solution may involve." />
    <section className="section soft"><div className="wrap contactGrid">
      <aside className="contactAside">
        <h2>Let’s begin with context.</h2>
        <p>We review each enquiry and respond with useful next questions—not a generic sales reply.</p>
        <div className="contactItem"><small>EMAIL</small><br /><a href={`mailto:${siteConfig.email.hello}`}><b>{siteConfig.email.hello} ↗</b></a></div>
        <div className="contactItem"><small>CALL</small><br /><a href={`tel:${siteConfig.phone}`}><b>{siteConfig.phoneDisplay} ↗</b></a></div>
        <div className="contactItem"><small>MARKET</small><br /><b>Nigeria and international</b></div>
        <div className="contactItem"><small>QUICK CHAT</small><br /><a href={siteConfig.whatsapp}><b>Continue on WhatsApp ↗</b></a></div>
      </aside>
      <ContactForm />
    </div></section>
  </>;
}
