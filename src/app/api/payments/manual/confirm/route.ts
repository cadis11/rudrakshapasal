export async function POST(req: Request) {
  try {
    const ct = (req.headers.get("content-type") || "").toLowerCase();
    let body: any = {};
    if (ct.includes("application/json")) body = await req.json();
    else body = Object.fromEntries((await req.formData()).entries());

    const orderId = String(body.orderId || "").trim();
    const provider = String(body.provider || "").trim().toUpperCase(); // "ESEWA" | "FONEPAY"
    const ref = String(body.ref || "").trim();
    const payerPhone = String(body.payerPhone || "").trim();
    const payerName = String(body.payerName || "").trim();

    if (!orderId || !provider) {
      return new Response("Missing orderId/provider", { status: 400 });
    }

    const pid = process.env.SANITY_PROJECT_ID!, ds = process.env.SANITY_DATASET || "production", ver = process.env.SANITY_API_VERSION || "2023-10-01";
    const token = process.env.SANITY_API_TOKEN;
    if (!pid || !token) return new Response("Server not configured", { status: 500 });

    const now = new Date().toISOString();
    const patch = { mutations: [{ patch: {
      query: `*[_type=="order" && orderId=="${orderId}"]`,
      set: { "payment.provider": provider, "payment.status": "pending_verification", "payment.claim": { ref, payerPhone, payerName }, "updatedAt": now },
      insert: { after: "history[-1]", items: [{ ts: now, event: "manual_claim", by: "buyer", provider, ref, payerPhone, payerName }] }
    }}] };

    const url = `https://${pid}.api.sanity.io/v${ver}/data/mutate/${ds}`;
    await fetch(url, { method: "POST", headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(patch) }).catch(()=>{});

    const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    return Response.redirect(`${site}/en/thanks/${orderId}`, 303);
  } catch(e:any){
    return new Response("Error", { status: 500 });
  }
}