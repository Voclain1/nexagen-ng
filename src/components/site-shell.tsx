import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { nav } from "@/lib/site";
import { MobileMenu } from "./mobile-menu";

export function Logo() { return <Link className="logo" href="/" aria-label="Nexagen home"><Image src="/nexagen-logo.png" alt="Nexagen" width={694} height={232} priority /></Link>; }
export function Arrow({ diagonal = false }: { diagonal?: boolean }) { return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>; }

/** One header for every page (the live site had two variants). */
export function Header() {
  return <header className="nav"><div className="wrap navin">
    <Logo />
    <MobileMenu>{nav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}<Link className="button dark" href="/contact/">Start a project ↗</Link></MobileMenu>
  </div></header>;
}

export function Footer() {
  return <footer className="footer"><div className="wrap foot">
    <div className="footlinks">
      <Link href="/">Home</Link><Link href="/services/">Services</Link><Link href="/services/website-design/">Website design</Link><Link href="/web-design-company-lagos/">Web design in Lagos</Link><Link href="/work/">Work</Link><Link href="/about/">About</Link><Link href="/insights/">Insights</Link><Link href="/videos/">Videos</Link><Link href="/learn/">Learn</Link><Link href="/contact/">Contact</Link>
      <a href={`tel:${siteConfig.phone}`}>Call {siteConfig.phoneDisplay}</a><a href={`mailto:${siteConfig.email.hello}`}>{siteConfig.email.hello}</a>
    </div>
    <small>© {new Date().getFullYear()} Nexagen Digital. Built in Nigeria.</small>
  </div></footer>;
}

/** Inner-page hero, matching the live site's .hero / .crumb / .accent pattern. */
export function PageIntro({ eyebrow, title, accent, lead }: { eyebrow: string; title: string; accent?: string; lead: string }) {
  return <section className="hero"><div className="wrap"><span className="crumb">{eyebrow}</span><h1>{title}{accent && <> <span className="accent">{accent}</span></>}</h1><p>{lead}</p></div></section>;
}

/** The live site's closing call to action. */
export function CtaBand({ title = "What should your next build solve?", lead = "Share the business goal and we will help shape the right approach." }: { title?: string; lead?: string }) {
  return <section className="cta"><div className="wrap ctaBox"><div><h2>{title}</h2><p>{lead}</p></div><Link className="button lime" href="/contact/">Start the conversation ↗</Link></div></section>;
}
