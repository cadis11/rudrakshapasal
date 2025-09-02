import { NextResponse } from "next/server";
import { computeTotals, validateCustomer, type OrderItem, type Customer, type PaymentMethod } from "@/lib/order";

function newId(prefix: string) {
  const t = new Date();
  const pad = (n:number)=> String(n).padStart(2,"0");
  const id = `${t.getFullYear()}${pad(t.getMonth()+1)}${pad(t.getDate())}-${Math.random().toString(36).slice(2,8)}`;
  return `${prefix}-${id}`;
}

export async function POST(req: Request) {
  const body = await req.json();
  const items: OrderItem[] = body?.items ?? [];
  const customer: Customer = body?.customer ?? {};
  const method: PaymentMethod = body?.paymentMethod ?? "COD";

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart empty" }, { status: 400 });
  }
  try { validateCustomer(customer); } catch (e:any) {
    return NextResponse.json({ error: e?.message ?? "Invalid customer" }, { status: 400 });
  }

  // Compute totals
  const totals = computeTotals(items);

  // Build order doc
  const orderId = newId("RP");
  const docId   = "order-" + orderId.toLowerCase();
  const nowIso  = new Date().toISOString();

  const orderDoc = {
    _id: docId,
    _type: "order",
    orderId,
    createdAt: nowIso,
    updatedAt: nowIso,
    currency: totals.currency,
    subtotalNPR: totals.subtotal,
    shippingNPR: totals.shipping,
    totalNPR: totals.total,
    items,
    customer,
    payment: {
      method,
      status: method === "COD" ? "cod" : "initiated",
      provider: method,
    },
    fulfillmentStatus: "new",
    history: [
      { ts: nowIso, event: "order_created", by: "site" }
    ],
  };

  // Write to Sanity
  const pid   = process.env.SANITY_PROJECT_ID!;
  const ds    = process.env.SANITY_DATASET || "production";
  const ver   = process.env.SANITY_API_VERSION || "2023-10-01";
  const token = process.env.SANITY_API_TOKEN;
  if (!pid || !ds || !ver || !token) {
    return NextResponse.json({ error: "Server is missing SANITY env" }, { status: 500 });
  }
  const mutateUrl = `https://${pid}.api.sanity.io/v${ver}/data/mutate/${ds}`;
  const res = await fetch(mutateUrl, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mutations: [{ createOrReplace: orderDoc }] }),
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.text().catch(()=> "");
    return NextResponse.json({ error: "Sanity write failed", detail: err }, { status: 500 });
  }

  // Decide redirect based on method
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  let redirectUrl = `${site}/en/order/${orderId}`;

  if (method === "ESEWA") {
    redirectUrl = `${site}/en/pay/esewa?id=${encodeURIComponent(orderId)}`;
  } else if (method === "FONEPAY") {
    redirectUrl = `${site}/en/pay/fonepay?id=${encodeURIComponent(orderId)}`;
  }

  return NextResponse.json({ ok: true, orderId, redirectUrl });
}