import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { isProduction } from "./config";

/**
 * Passwordless auth: a signed, short-lived magic link proves ownership of an email,
 * then a signed httpOnly session cookie keeps the learner signed in. No password
 * storage, no third-party auth service. Requires AUTH_SECRET (32+ random chars) in production.
 */

export const SESSION_COOKIE = "nx_session";
const SESSION_DAYS = 30;
const LINK_MINUTES = 20;

type Payload = { email: string; purpose: "login" | "session"; exp: number; next?: string };

function secret() {
  const value = process.env.AUTH_SECRET;
  if (value && value.length >= 32) return value;
  if (isProduction) throw new Error("AUTH_SECRET must be set (32+ characters) in production.");
  return "development-only-insecure-secret-change-me-please";
}

const hmac = (data: string) => crypto.createHmac("sha256", secret()).update(data).digest("base64url");

function sign(payload: Payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${hmac(body)}`;
}

function verify(token: string | undefined, purpose: Payload["purpose"]): Payload | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = Buffer.from(hmac(body));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Payload;
    return payload.purpose === purpose && payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const isEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;

/** Only allow same-site relative redirects (prevents open redirects). */
export const safeNext = (next: unknown) => (typeof next === "string" && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : "/account/");

export const createLoginToken = (email: string, next?: string) => sign({ email: normalizeEmail(email), purpose: "login", exp: Date.now() + LINK_MINUTES * 60_000, next: safeNext(next) });
export const verifyLoginToken = (token: string | undefined) => verify(token, "login");

export function sessionCookie(email: string) {
  return {
    name: SESSION_COOKIE,
    value: sign({ email: normalizeEmail(email), purpose: "session", exp: Date.now() + SESSION_DAYS * 86_400_000 }),
    options: { httpOnly: true, secure: isProduction, sameSite: "lax" as const, path: "/", maxAge: SESSION_DAYS * 86_400 },
  };
}

export async function getSession(): Promise<{ email: string } | null> {
  const payload = verify((await cookies()).get(SESSION_COOKIE)?.value, "session");
  return payload ? { email: payload.email } : null;
}
