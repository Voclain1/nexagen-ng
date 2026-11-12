import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/forms";
import { getSession, safeNext } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function SignIn({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  if (await getSession()) redirect(safeNext(next));
  return <section className="hero auth-page"><div className="wrap auth-grid">
    <div><p className="eyebrow">Nexagen Learn</p><h1 className="h-md">Sign in with your email.</h1><p className="page-lead" style={{ marginLeft: 0 }}>No password needed. We’ll email you a secure link that signs you in on this device for 30 days.</p></div>
    <div>{error === "expired" && <p className="form-status error" role="alert">That link has expired or was already replaced. Request a new one below.</p>}<SignInForm next={safeNext(next)} /></div>
  </div></section>;
}
