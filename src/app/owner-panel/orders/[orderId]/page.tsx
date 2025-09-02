import { sanityQuery, sanityMutate } from "@/lib/sanity";
export const dynamic = "force-dynamic";

async function getOrder(orderId: string){
  const groq = `*[_type=="order" && orderId=="${orderId}"][0]`;
  return await sanityQuery<any>(groq);
}
async function markReceived(orderId: string){
  "use server";
  const now = new Date().toISOString();
  await sanityMutate({ mutations: [{ patch: {
    query: `*[_type=="order" && orderId=="${orderId}"]`,
    set: { "payment.status": "paid", updatedAt: now },
    insert: { after: "history[-1]", items: [{ ts: now, event: "received", by: "owner" }] }
  }}]});
}
async function rejectClaim(orderId: string, reason: string){
  "use server";
  const now = new Date().toISOString();
  await sanityMutate({ mutations: [{ patch: {
    query: `*[_type=="order" && orderId=="${orderId}"]`,
    set: { "payment.status": "failed", "payment.rejectReason": reason, updatedAt: now },
    insert: { after: "history[-1]", items: [{ ts: now, event: "claim_rejected", by: "owner", reason }] }
  }}]});
}

export default async function Page({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const o = await getOrder(orderId);
  if (!o) return <main className="mx-auto max-w-4xl px-6 py-10">Not found.</main>;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold mb-2">Order {o.orderId}</h1>
      <div className="text-neutral-300 mb-6">Payment: <b>{o.payment?.status}</b> • Fulfillment: <b>{o.fulfillmentStatus}</b></div>

      {o.payment?.claim && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 text-amber-200 p-3 mb-6">
          Claim: {o.payment.provider || ""}{o.payment.claim.ref ? <> • Ref <b>{o.payment.claim.ref}</b></> : null}
          {o.payment.claim.payerPhone ? <> • {o.payment.claim.payerPhone}</> : null}
          {o.payment.claim.payerName ? <> • {o.payment.claim.payerName}</> : null}
        </div>
      )}

      <section className="rounded-xl border border-white/10 bg-black/20 p-4 mb-6">
        <h2 className="font-semibold mb-2">Items</h2>
        <div className="divide-y divide-white/10">
          {o.items?.map((it: any)=>(
            <div key={it.id} className="py-3 flex items-center gap-3">
              <div className="h-14 w-14 grid place-items-center bg-neutral-900 rounded-md overflow-hidden">
                {it.imageUrl ? <img src={it.imageUrl} alt={it.name} className="max-h-14 w-auto object-contain" /> : <div className="text-xs text-neutral-400">No image</div>}
              </div>
              <div className="flex-1">
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-neutral-400">Qty {it.qty} • NPR {it.priceNPR ?? 0}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right text-lg">Total: <span className="font-semibold">NPR {o.totalNPR}</span></div>
      </section>

      <section className="rounded-xl border border-white/10 bg-black/20 p-4">
        <h2 className="font-semibold mb-3">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <form action={async ()=>{ "use server"; await markReceived(o.orderId); }}>
            <button className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2">Mark Received</button>
          </form>
          <form action={async (fd: FormData)=>{ "use server"; await rejectClaim(o.orderId, String(fd.get("reason")||"")); }}>
            <input name="reason" placeholder="Reject reason" className="rounded bg-neutral-900 border border-white/15 px-2 py-2 mr-2" />
            <button className="rounded-lg border border-white/15 px-4 py-2">Reject Claim</button>
          </form>
        </div>
      </section>
    </main>
  );
}