type Order = any;

async function getOrder(orderId: string): Promise<Order | null> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/orders/${orderId}`, { cache: "no-store" });
  if (!res.ok) return null;
  return await res.json();
}

export default async function Page({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  if (!id) return <main className="mx-auto max-w-xl px-6 py-10">Missing order id.</main>;
  const order = await getOrder(id);
  if (!order) return <main className="mx-auto max-w-xl px-6 py-10">Order not found.</main>;

  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const amt = Number(order.totalNPR || 0);
  const qr  = process.env.ESEWA_QR_URL || "/qr/esewa.png";
  const label = process.env.ESEWA_ACCOUNT_LABEL || "eSewa";

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <h1 className="text-2xl font-bold mb-4">Pay with eSewa</h1>

      <div className="rounded-xl border border-white/10 bg-black/20 p-4 mb-4">
        <div>Order: <b>{order.orderId}</b></div>
        <div>Amount: <b>NPR {amt}</b></div>
        <div className="text-sm text-neutral-400 mt-1">Scan & pay to <b>{label}</b>. Put <b>{order.orderId}</b> in remarks.</div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 p-4 grid place-items-center mb-4">
        <img src={qr} alt="eSewa QR" className="max-h-80 w-auto object-contain" />
      </div>

      <form action="/api/payments/manual/confirm" method="POST" className="rounded-xl border border-white/10 bg-black/20 p-4">
        <input type="hidden" name="orderId" value={order.orderId} />
        <input type="hidden" name="provider" value="ESEWA" />
        <div className="grid gap-3">
          <input name="ref" placeholder="Transaction ID / Ref" className="rounded bg-neutral-900 border border-white/15 px-3 py-2" />
          <input name="payerPhone" placeholder="Your phone used in eSewa" className="rounded bg-neutral-900 border border-white/15 px-3 py-2" />
          <input name="payerName" placeholder="Account name (optional)" className="rounded bg-neutral-900 border border-white/15 px-3 py-2" />
          <button className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2 font-medium" type="submit">
            I’ve paid — submit for verification
          </button>
          <a href={`/en/order/${order.orderId}`} className="text-sm underline text-neutral-300">Back to order</a>
        </div>
      </form>
    </main>
  );
}