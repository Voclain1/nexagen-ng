import "server-only";
import { isProduction, siteConfig } from "./config";

/**
 * Transactional email + newsletter via Resend (https://resend.com).
 * RESEND_API_KEY      — API key (domain nexagen.ng must be verified in Resend)
 * EMAIL_FROM          — e.g. "Nexagen <hello@nexagen.ng>"
 * RESEND_AUDIENCE_ID  — audience that newsletter sign-ups are added to
 * Without an API key (local development) emails are printed to the server console.
 */

const from = () => process.env.EMAIL_FROM ?? `Nexagen <${siteConfig.email.hello}>`;

async function resend(pathname: string, body: unknown) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Never pretend an email was sent in production: the form then tells the visitor to email/WhatsApp directly.
    if (isProduction) { console.error(`[email] RESEND_API_KEY is not set; could not send ${pathname}`); return { ok: false, dev: false }; }
    console.info(`[email:dev] ${pathname}\n${JSON.stringify(body, null, 2)}`);
    return { ok: true, dev: true };
  }
  const response = await fetch(`https://api.resend.com${pathname}`, { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!response.ok) console.error(`[email] Resend ${pathname} failed: ${response.status} ${await response.text()}`);
  return { ok: response.ok, dev: false };
}

const escape = (value: string) => value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const layout = (heading: string, body: string) => `<!doctype html><html><body style="margin:0;background:#f3f1e9;font-family:Helvetica,Arial,sans-serif;color:#10110f"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px"><table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:4px"><tr><td style="background:#10110f;padding:22px 32px;color:#d7ff64;font-weight:700;letter-spacing:.12em;font-size:12px">NEXAGEN</td></tr><tr><td style="padding:36px 32px"><h1 style="margin:0 0 18px;font-size:26px;letter-spacing:-.02em">${heading}</h1>${body}</td></tr></table><p style="font-size:11px;color:#65665f">Nexagen Digital · Lagos, Nigeria · ${siteConfig.url.replace("https://", "")}</p></td></tr></table></body></html>`;
const button = (href: string, label: string) => `<a href="${href}" style="display:inline-block;background:#d7ff64;color:#10110f;padding:14px 22px;font-weight:700;text-decoration:none;border-radius:2px">${label}</a>`;

export function sendMagicLink(email: string, link: string) {
  return resend("/emails", {
    from: from(), to: email, subject: "Your Nexagen sign-in link",
    html: layout("Sign in to Nexagen", `<p style="line-height:1.6;color:#444">Use the button below to sign in. The link expires in 20 minutes and only works for ${escape(email)}.</p><p style="margin:28px 0">${button(link, "Sign in →")}</p><p style="font-size:12px;color:#888;line-height:1.6">If you didn’t request this, you can ignore this email.</p>`),
    text: `Sign in to Nexagen: ${link}\n\nThe link expires in 20 minutes.`,
  });
}

export function sendPurchaseReceipt(email: string, title: string, url: string, amount: string) {
  return resend("/emails", {
    from: from(), to: email, subject: `You now have access: ${title}`,
    html: layout("Thanks — you’re in.", `<p style="line-height:1.6;color:#444">Your payment of <strong>${escape(amount)}</strong> was successful and <strong>${escape(title)}</strong> is now in your library.</p><p style="margin:28px 0">${button(url, "Start learning →")}</p>`),
    text: `Your payment of ${amount} was successful. Access ${title}: ${url}`,
  });
}

export function sendEnquiry(fields: Record<string, string>) {
  const rows = Object.entries(fields).map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#888;vertical-align:top;font-size:12px;text-transform:uppercase">${escape(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${escape(v)}</td></tr>`).join("");
  return resend("/emails", { from: from(), to: siteConfig.email.enquiry, reply_to: fields.email, subject: `Project enquiry — ${fields.name}${fields.company ? ` (${fields.company})` : ""}`, html: layout("New project enquiry", `<table>${rows}</table>`) });
}

export function subscribeToNewsletter(email: string, source: string) {
  const audience = process.env.RESEND_AUDIENCE_ID;
  if (!audience) return resend("/dev/newsletter", { email, source });
  return resend(`/audiences/${audience}/contacts`, { email, unsubscribed: false });
}
