import { sanityQuery, sanityMutate } from "@/lib/sanity";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function markReceived(orderId: string) {
  "use server";
  const now = new Date().toISOString();
  await sanityMutate({ mutations: [{ patch: {
    query: `*[_type=="order" && orderId=="${orderId}"]`,
    set: { "payment.status": "paid", updatedAt: now },
    insert: { after: "history[-1]", items: [{ ts: now, event: "received", by: "owner" }] }
  }}]});
}
async function rejectClaim(orderId: string, reason: string) {
  "use server";
  const now = new Date().toISOString();
  await sanityMutate({ mutations: [{ patch: {
    query: `*[_type=="order" && orderId=="${orderId}"]`,
    set: { "payment.status": "failed", "payment.rejectReason": reason, updatedAt: now },
    insert: { after: "history[-1]", items: [{ ts: now, event: "claim_rejected", by: "owner", reason }] }
  }}]});
}

async function fetchOrders(qs: { q?: string; status?: string; pstatus?: string }) {
  const q = (qs.q || "").trim();
  const f1 = qs.status ? ` && fulfillmentStatus=="${qs.status}"` : "";
  const f2 = qs.pstatus ? ` && payment.status=="${qs.pstatus}"` : "";
  const search = q ? ` && (orderId match "${q}*" || customer.phone match "${q}*" || customer.name match "${q}*")` : "";
  const groq = `*[_type=="order"${f1}${f2}${search}] | order(createdAt desc)[0...200]{
    orderId, createdAt, totalNPR, fulfillmentStatus, payment, customer, courier, trackingNumber
  }`;
  return await (await import("@/lib/sanity")).sanityQuery<any[]>(groq);
}

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; pstatus?: string }> }) {
  const sp = await searchParams;
  const items = await fetchOrders(sp);

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Owner Panel — Orders</h1>

      <form className="mb-4 grid gap-3 sm:grid-cols-3" action="/owner-panel/orders" method="GET">
        <input name="q" defaultValue={sp.q || ""} placeholder="Search orderId, name, phone" className="rounded-lg bg-neutral-900 border border-white/15 px-3 py-2" />
        <select name="status" defaultValue={sp.status || ""} className="rounded-lg bg-neutral-900 border border-white/15 px-3 py-2">
          <option value="">All Fulfillment</option>
          <option value="new">New</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select name="pstatus" defaultValue={sp.pstatus || ""} className="rounded-lg bg-neutral-900 border border-white/15 px-3 py-2">
          <option value="">All Payment</option>
          <option value="cod">COD</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="pending_verification">Pending verification</option>
          <option value="initiated">Initiated</option>
        </select>
        <button className="rounded-lg border border-white/15 px-3 py-2">Filter</button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-black/30 text-neutral-300">
            <tr>
              <th className="text-left p-2">Order</th>
              <th className="text-left p-2">Customer</th>
              <th className="text-left p-2">Total</th>
              <th className="text-left p-2">Payment</th>
              <th className="text-left p-2">Fulfillment</th>
              <th className="text-left p-2">Claim</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {items.map((o)=>(
              <tr key={o.orderId} className="align-top">
                <td className="p-2">
                  <div className="font-medium"><Link className="underline" href={`/owner-panel/orders/${o.orderId}`}>{o.orderId}</Link></div>
                  <div className="text-neutral-400">{new Date(o.createdAt).toLocaleString()}</div>
                </td>
                <td className="p-2">
                  <div className="font-medium">{o.customer?.name}</div>
                  <div className="text-neutral-400">{o.customer?.phone}</div>
                </td>
                <td className="p-2">NPR {o.totalNPR}</td>
                <td className="p-2">{o.payment?.status} ({o.payment?.provider || "—"})</td>
                <td className="p-2">{o.fulfillmentStatus || "new"}</td>
                <td className="p-2">
                  {o.payment?.claim?.ref ? <>Ref: <b>{o.payment.claim.ref}</b></> : "—"}
                </td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-2">
                    <form action={async ()=>{ "use server"; await markReceived(o.orderId); }}>
                      <button className="underline text-emerald-400">Mark Received</button>
                    </form>
                    <form action={async (fd: FormData)=>{ "use server"; await rejectClaim(o.orderId, String(fd.get("reason")||"")); }}>
                      <input name="reason" placeholder="Reason" className="w-36 rounded bg-neutral-900 border border-white/15 px-2 py-1" />
                      <button className="underline text-red-300">Reject</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {items.length===0 && (
              <tr><td colSpan={7} className="p-4 text-neutral-400">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}