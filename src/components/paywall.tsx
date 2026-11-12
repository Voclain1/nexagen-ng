import Link from "next/link";
import type { AccessState } from "@/lib/access";
import { formatPrice, type Course, type Resource } from "@/lib/content";

const notices: Record<string, string> = {
  unavailable: "Checkout isn’t switched on yet. Email hello@nexagen.ng and we’ll get you access.",
  error: "We couldn’t start the payment. Please try again in a moment.",
};

/** The access panel for a gated course or resource: start, sign in, or buy. */
export function AccessPanel({ product, state, startHref, checkout, purchased }: { product: Course | Resource; state: AccessState; startHref: string; checkout?: string; purchased?: boolean }) {
  const back = product.kind === "course" ? `/learn/${product.slug}/` : `/learn/resources/${product.slug}/`;
  return <div className="access-panel">
    {purchased && state.status === "open" && <p className="form-status success" role="status">Payment confirmed — welcome aboard.</p>}
    {checkout && notices[checkout] && <p className="form-status error" role="alert">{notices[checkout]}</p>}
    <p className="access-price">{product.access === "paid" && product.price ? formatPrice(product.price) : "Free"}</p>
    <p className="access-note">{product.access === "paid" ? "One-time payment · lifetime access · secure checkout by Paystack" : product.access === "email" ? "Free with a Nexagen account — just your email." : "Free and open to everyone."}</p>
    {state.status === "open" && (startHref.startsWith("/api/") ? <a className="button dark block" href={startHref} download>Download ↗</a> : <Link className="button dark block" href={startHref}>{product.kind === "course" ? "Start learning" : "Open"} ↗</Link>)}
    {state.status === "signin" && product.access === "email" && <Link className="button dark block" href={`/account/sign-in/?next=${encodeURIComponent(back)}`}>Get free access ↗</Link>}
    {(state.status === "purchase" || (state.status === "signin" && product.access === "paid")) && <form action="/api/checkout/" method="post"><input type="hidden" name="product" value={product.productKey} /><button className="button dark block" type="submit">Buy now{product.price ? ` · ${formatPrice(product.price)}` : ""} ↗</button></form>}
    {state.email ? <p className="access-signed">Signed in as {state.email}</p> : <p className="access-signed">Already have access? <Link href={`/account/sign-in/?next=${encodeURIComponent(back)}`}>Sign in</Link></p>}
  </div>;
}
