import "server-only";
import { getSession } from "./auth";
import { absoluteUrl } from "./config";
import { formatPrice, getProduct, type Course, type Resource } from "./content";
import { sendPurchaseReceipt } from "./email";
import { toSubunit } from "./paystack";
import { store } from "./store";

export type AccessState = { status: "open" | "signin" | "purchase"; email?: string };

/** Decides whether the current visitor can open a gated course lesson or resource. */
export async function checkAccess(product: Course | Resource): Promise<AccessState> {
  if (product.access === "free") return { status: "open" };
  const session = await getSession();
  if (!session) return { status: "signin" };
  if (product.access === "email") return { status: "open", email: session.email };
  return (await store().hasEntitlement(session.email, product.productKey)) ? { status: "open", email: session.email } : { status: "purchase", email: session.email };
}

export const productUrl = (product: Course | Resource) => (product.kind === "course" ? `/learn/${product.slug}/` : `/learn/resources/${product.slug}/`);

/**
 * Grants access for a verified Paystack payment. Called by both the browser callback and the
 * webhook, so it must be idempotent and must check the amount actually paid.
 */
export async function fulfilOrder(reference: string, paid: { status: string; amount: number; currency: string }) {
  const orders = store();
  const order = await orders.getOrder(reference);
  if (!order) return { ok: false as const, reason: "unknown-order" };
  if (order.status === "paid") return { ok: true as const, order, alreadyPaid: true };
  if (paid.status !== "success") { await orders.setOrderStatus(reference, "failed"); return { ok: false as const, reason: "not-successful" }; }
  if (paid.amount < order.amount || paid.currency !== order.currency) return { ok: false as const, reason: "amount-mismatch" };
  await orders.grant({ email: order.email, product: order.product, source: "purchase", reference });
  await orders.setOrderStatus(reference, "paid");
  const product = getProduct(order.product);
  if (product?.price) await sendPurchaseReceipt(order.email, product.title, absoluteUrl(productUrl(product)), formatPrice(product.price));
  return { ok: true as const, order, alreadyPaid: false };
}

export const expectedAmount = (product: Course | Resource) => (product.price ? toSubunit(product.price.amount) : 0);
