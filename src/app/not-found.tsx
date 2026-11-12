import Link from "next/link";
import { PageIntro } from "@/components/site-shell";

export default function NotFound() {
  return <div className="pg"><PageIntro eyebrow="404 · Page not found" title="This page has" accent="moved on." lead="The link may be old or mistyped. These are good places to pick up the trail." />
    <section className="section soft"><div className="wrap chip-row"><Link className="chip" href="/services/">Services</Link><Link className="chip" href="/work/">Our work</Link><Link className="chip" href="/insights/">Insights</Link><Link className="chip" href="/learn/">Learn</Link><Link className="chip" href="/contact/">Start a project</Link></div></section></div>;
}
