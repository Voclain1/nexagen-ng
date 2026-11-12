"use server";

import { createLoginToken, isEmail, normalizeEmail, safeNext } from "@/lib/auth";
import { absoluteUrl, isProduction } from "@/lib/config";
import { sendEnquiry, sendMagicLink, subscribeToNewsletter } from "@/lib/email";

export type FormState = { status: "idle" | "success" | "error"; message?: string; devLink?: string };

const text = (form: FormData, key: string, max = 4000) => String(form.get(key) ?? "").trim().slice(0, max);
/** Bots fill every field; humans never see this one. */
const isBot = (form: FormData) => text(form, "website") !== "";

export async function requestSignIn(_: FormState, form: FormData): Promise<FormState> {
  if (isBot(form)) return { status: "success", message: "Check your inbox." };
  const email = normalizeEmail(text(form, "email", 254));
  if (!isEmail(email)) return { status: "error", message: "Enter a valid email address." };
  const link = absoluteUrl(`/api/auth/verify?token=${createLoginToken(email, safeNext(text(form, "next")))}`);
  const sent = await sendMagicLink(email, link);
  if (!sent.ok) return { status: "error", message: "We couldn’t send the email. Please try again shortly." };
  if (form.get("newsletter") === "on") await subscribeToNewsletter(email, "sign-in");
  // In local development without an email provider, surface the link so the flow is testable.
  const devLink = !isProduction && sent.dev ? link.replace(absoluteUrl("/"), "/") : undefined;
  return { status: "success", message: `We’ve sent a sign-in link to ${email}. It expires in 20 minutes.`, devLink };
}

export async function subscribe(_: FormState, form: FormData): Promise<FormState> {
  if (isBot(form)) return { status: "success", message: "You’re subscribed." };
  const email = normalizeEmail(text(form, "email", 254));
  if (!isEmail(email)) return { status: "error", message: "Enter a valid email address." };
  const result = await subscribeToNewsletter(email, text(form, "source", 100) || "site");
  return result.ok ? { status: "success", message: "You’re in. New guides and tutorials will land in your inbox." } : { status: "error", message: "Something went wrong. Please try again." };
}

export async function sendContact(_: FormState, form: FormData): Promise<FormState> {
  if (isBot(form)) return { status: "success", message: "Thanks — we’ll be in touch." };
  const fields = { name: text(form, "name", 200), email: normalizeEmail(text(form, "email", 254)), company: text(form, "company", 200), phone: text(form, "phone", 40), service: text(form, "service", 100), message: text(form, "message") };
  if (!fields.name || !isEmail(fields.email) || fields.message.length < 10) return { status: "error", message: "Please add your name, a valid email and a short description of the project." };
  const result = await sendEnquiry(fields);
  return result.ok ? { status: "success", message: "Thanks — your enquiry is with us. We reply within two business days." } : { status: "error", message: "We couldn’t send your enquiry. Please email hello@nexagen.ng or WhatsApp +234 906 708 4003." };
}
