"use client";

import { useActionState } from "react";
import { requestSignIn, sendContact, subscribe, type FormState } from "@/app/actions";

const initial: FormState = { status: "idle" };
const Honeypot = () => <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp" />;
const Status = ({ state }: { state: FormState }) => state.message ? <p className={`form-status ${state.status}`} role={state.status === "error" ? "alert" : "status"}>{state.message}</p> : null;

export function SignInForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(requestSignIn, initial);
  if (state.status === "success") return <div className="auth-sent"><Status state={state} />{state.devLink && <p className="dev-note">Dev mode (no RESEND_API_KEY): <a href={state.devLink}>open sign-in link</a></p>}</div>;
  return <form action={action} className="stack-form">
    <Honeypot />
    <input type="hidden" name="next" value={next ?? "/account/"} />
    <div className="field"><label htmlFor="signin-email">Email address</label><input id="signin-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" /></div>
    <label className="check"><input type="checkbox" name="newsletter" /> Send me new tutorials and guides (unsubscribe anytime)</label>
    <button className="button dark" type="submit" disabled={pending}>{pending ? "Sending…" : "Email me a sign-in link ↗"}</button>
    <Status state={state} />
  </form>;
}

export function NewsletterForm({ source, dark = false }: { source: string; dark?: boolean }) {
  const [state, action, pending] = useActionState(subscribe, initial);
  return <form action={action} className={`newsletter-form${dark ? " dark" : ""}`}>
    <Honeypot />
    <input type="hidden" name="source" value={source} />
    {state.status === "success" ? <Status state={state} /> : <>
      <label htmlFor={`nl-${source}`} className="sr-only">Email address</label>
      <input id={`nl-${source}`} name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
      <button className="button lime" type="submit" disabled={pending}>{pending ? "…" : "Subscribe"}</button>
      <Status state={state} />
    </>}
  </form>;
}

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initial);
  if (state.status === "success") return <div className="form"><div className="field full"><Status state={state} /></div></div>;
  return <form className="form" action={action}>
    <Honeypot />
    <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" required autoComplete="name" /></div>
    <div className="field"><label htmlFor="company">Company</label><input id="company" name="company" autoComplete="organization" /></div>
    <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" name="email" required autoComplete="email" /></div>
    <div className="field"><label htmlFor="phone">Phone / WhatsApp</label><input id="phone" name="phone" type="tel" autoComplete="tel" /></div>
    <div className="field full"><label htmlFor="type">What do you need?</label><select id="type" name="service"><option>Business website</option><option>Website redesign</option><option>E-commerce store</option><option>Custom platform or portal</option><option>SEO and content growth</option><option>Not sure yet</option></select></div>
    <div className="field full"><label htmlFor="details">What should this project achieve?</label><textarea id="details" name="message" required minLength={10} /></div>
    <div className="field full"><button className="button lime" type="submit" disabled={pending}>{pending ? "Sending…" : "Send project enquiry ↗"}</button><Status state={state} /></div>
  </form>;
}
