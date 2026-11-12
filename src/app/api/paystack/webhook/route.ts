import { NextResponse, type NextRequest } from "next/server";
import { fulfilOrder } from "@/lib/access";
import { isValidWebhook, verifyTransaction } from "@/lib/paystack";

/**
 * Paystack webhook (set in Dashboard → Settings → API Keys & Webhooks).
 * Guarantees access is granted even if the buyer closes the tab before the callback.
 */
export async function POST(request: NextRequest) {
  const raw = await request.text();
  if (!isValidWebhook(raw, request.headers.get("x-paystack-signature"))) return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  const event = JSON.parse(raw) as { event: string; data: { reference: string } };
  if (event.event === "charge.success") {
    const paid = await verifyTransaction(event.data.reference);
    if (paid) {
      const result = await fulfilOrder(event.data.reference, paid);
      if (!result.ok) console.warn(`[paystack] ${event.data.reference}: ${result.reason}`);
    }
  }
  return NextResponse.json({ received: true });
}
