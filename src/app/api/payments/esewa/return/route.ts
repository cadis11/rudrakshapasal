import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "failed";
  const oid    = searchParams.get("oid") || "";
  const amt    = searchParams.get("amt") || "";

  const pid   = process.env.SANITY_PROJECT_ID!;
  const ds    = process.env.SANITY_DATASET || "production";
  const ver   = process.env.SANITY_API_VERSION || "2023-10-01";
  const token = process.env.SANITY_API_TOKEN;

  const now = new Date().toISOString();
  const payStatus = status === "success" ? "paid" : "failed";

  const patch = {
    mutations: [
      {
        patch: {
          query: `*[_type=="order" && orderId=="${oid}"]`,
          set: {
            "payment.status": payStatus,
            "payment.provider": "ESEWA",
            "updatedAt": now
          },
          insert: {
            "after": "history[-1]",
            items: [{ ts: now, event: `esewa_${payStatus}`, by: "esewa", amt }]
          }
        }
      }
    ]
  };

  const url = `https://${pid}.api.sanity.io/v${ver}/data/mutate/${ds}`;
  await fetch(url, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(patch)
  }).catch(()=>{});

  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return Response.redirect(`${site}/en/order/${oid}`, 302);
}