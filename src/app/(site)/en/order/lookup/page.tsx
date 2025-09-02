"use client";
import { useState } from "react";

export default function OrderLookup() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<any | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function lookup() {
    setErr(null); setOrder(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
      const data = await res.json();
      if (!res.ok || !data) throw new Error("Not found");
      if (data?.customer?.phone?.replace(/\s+/g,"") !== phone.replace(/\s+/g,"")) throw new Error("Phone mismatch");
      setOrder(data);
    } catch (e:any) {
      setErr(e?.message || "Lookup failed");
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-2xl font-bold mb-4">Track your order</h1>
      <input placeholder="Order ID (e.g., RP-20250902-abc123)" value={orderId} onChange={e=>setOrderId(e.target.value)} className="w-full rounded-lg bg-neutral-900 border border-white/15 px-3 py-2 mb-2" />
      <input placeholder="Phone used on order" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full rounded-lg bg-neutral-900 border border-white/15 px-3 py-2 mb-4" />
      <button onClick={lookup} className="rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-5 py-2 font-medium">Lookup</button>
      {err && <div className="text-red-300 mt-3">{err}</div>}
      {order && (
        <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="font-semibold mb-1">Order {order.orderId}</div>
          <div className="text-neutral-300 mb-2">Payment: {order.payment?.status} • Fulfillment: {order.fulfillmentStatus}</div>
          <div className="text-sm text-neutral-400">{order.customer?.name} • {order.customer?.phone}</div>
        </div>
      )}
    </main>
  );
}