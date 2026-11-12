import "server-only";
import crypto from "node:crypto";

/**
 * Paystack (https://paystack.com) — cards, bank transfer and USSD for NGN; USD for eligible merchants.
 * PAYSTACK_SECRET_KEY: sk_test_… for testing, sk_live_… in production.
 * Webhook URL to set in the Paystack dashboard: https://nexagen.ng/api/paystack/webhook/ (trailing slash matters)
 */

const API = "https://api.paystack.co";
const key = () => {
  const value = process.env.PAYSTACK_SECRET_KEY;
  if (!value) throw new Error("PAYSTACK_SECRET_KEY is not set.");
  return value;
};
export const isPaystackConfigured = () => Boolean(process.env.PAYSTACK_SECRET_KEY);

/** Amounts in content are whole units (₦25,000); Paystack wants the subunit (kobo/cents). */
export const toSubunit = (amount: number) => Math.round(amount * 100);

export async function initializeTransaction(input: { email: string; amount: number; currency: string; reference: string; callbackUrl: string; metadata: Record<string, string> }) {
  const response = await fetch(`${API}/transaction/initialize`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email: input.email, amount: input.amount, currency: input.currency, reference: input.reference, callback_url: input.callbackUrl, metadata: input.metadata }),
  });
  const json = await response.json();
  if (!response.ok || !json.status) throw new Error(`Paystack initialize failed: ${json.message ?? response.status}`);
  return json.data as { authorization_url: string; reference: string };
}

export async function verifyTransaction(reference: string) {
  const response = await fetch(`${API}/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${key()}` }, cache: "no-store" });
  const json = await response.json();
  if (!response.ok || !json.status) return null;
  return json.data as { status: string; amount: number; currency: string; reference: string; customer: { email: string } };
}

export function isValidWebhook(rawBody: string, signature: string | null) {
  if (!signature) return false;
  const expected = Buffer.from(crypto.createHmac("sha512", key()).update(rawBody).digest("hex"));
  const given = Buffer.from(signature);
  return expected.length === given.length && crypto.timingSafeEqual(expected, given);
}
