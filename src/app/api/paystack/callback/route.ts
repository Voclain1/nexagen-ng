import { NextResponse, type NextRequest } from "next/server";
import { fulfilOrder, productUrl } from "@/lib/access";
import { getProduct } from "@/lib/content";
import { verifyTransaction } from "@/lib/paystack";

/** Paystack redirects the buyer here. We verify server-to-server before granting anything. */
export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference") ?? request.nextUrl.searchParams.get("trxref");
  if (!reference) return NextResponse.redirect(new URL("/learn/", request.url));
  const paid = await verifyTransaction(reference);
  const result = paid ? await fulfilOrder(reference, paid) : { ok: false as const, reason: "unverified" };
  const product = result.ok ? getProduct(result.order.product) : undefined;
  const target = product ? `${productUrl(product)}?purchased=1` : `/account?checkout=${result.ok ? "ok" : "failed"}`;
  return NextResponse.redirect(new URL(target, request.url));
}
