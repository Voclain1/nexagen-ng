import crypto from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { expectedAmount, productUrl } from "@/lib/access";
import { getSession } from "@/lib/auth";
import { absoluteUrl } from "@/lib/config";
import { getProduct } from "@/lib/content";
import { initializeTransaction, isPaystackConfigured } from "@/lib/paystack";
import { isStoreConfigured, store } from "@/lib/store";

/** Form POST from a paid course/resource page → creates an order → redirects to Paystack. */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const product = getProduct(String(form.get("product") ?? ""));
  if (!product || product.access !== "paid" || !product.price) return NextResponse.json({ error: "Unknown product" }, { status: 404 });
  const back = productUrl(product);

  const session = await getSession();
  if (!session) return NextResponse.redirect(new URL(`/account/sign-in/?next=${encodeURIComponent(back)}`, request.url), 303);
  if (await store().hasEntitlement(session.email, product.productKey)) return NextResponse.redirect(new URL(back, request.url), 303);
  if (!isPaystackConfigured() || !isStoreConfigured()) return NextResponse.redirect(new URL(`${back}?checkout=unavailable`, request.url), 303);

  const reference = `nx_${crypto.randomUUID().replace(/-/g, "")}`;
  const amount = expectedAmount(product);
  await store().createOrder({ reference, email: session.email, product: product.productKey, amount, currency: product.price.currency });
  try {
    const { authorization_url } = await initializeTransaction({ email: session.email, amount, currency: product.price.currency, reference, callbackUrl: absoluteUrl("/api/paystack/callback/"), metadata: { product: product.productKey, title: product.title } });
    return NextResponse.redirect(authorization_url, 303);
  } catch (error) {
    console.error(error);
    await store().setOrderStatus(reference, "failed");
    return NextResponse.redirect(new URL(`${back}?checkout=error`, request.url), 303);
  }
}
