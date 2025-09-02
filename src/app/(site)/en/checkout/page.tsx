"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import type { PaymentMethod } from "@/lib/order";

export default function CheckoutPage(){
  const { state } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", phone: "", email: "", addressLine1: "", city: "", notes: "",
    paymentMethod: "COD" as PaymentMethod,
  });
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(){
    setErr(null);
    if (state.items.length === 0) { setErr("Your cart is empty"); return; }
    if (!form.name || !form.phone || !form.addressLine1) { setErr("Name, phone, and address are required"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: state.items,
          customer: {
            name: form.name, phone: form.phone, email: form.email,
            addressLine1: form.addressLine1, city: form.city, notes: form.notes
          },
          paymentMethod: form.paymentMethod,
        }),
      });

      const raw = await res.text();
      let data: any = null;
      try { data = raw ? JSON.parse(raw) : null; } catch { /* ignore parse error, use raw */ }

      if (!res.ok) {
        const msg = (data && (data.error || data.message)) || raw || `HTTP ${res.status}`;
        throw new Error(msg);
      }

      const redirectUrl = data?.redirectUrl || (data?.orderId ? `/en/order/${data.orderId}` : null);
      if (!redirectUrl) throw new Error("Order created but missing redirect URL");
      router.push(redirectUrl);
    } catch (e:any) {
      console.error("checkout error:", e);
      setErr(e?.message || "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid gap-6">
        <section className="rounded-xl border border-white/10 bg-black/20 p-4">
          <h2 className="font-semibold mb-3">Contact & Shipping</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <input placeholder="Full name" className="rounded-lg bg-neutral-900 border border-white/15 px-3 py-2"
              value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
            <input placeholder="Phone" className="rounded-lg bg-neutral-900 border border-white/15 px-3 py-2"
              value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
            <input placeholder="Email (optional)" className="rounded-lg bg-neutral-900 border border-white/15 px-3 py-2 sm:col-span-2"
              value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
            <input placeholder="Address" className="rounded-lg bg-neutral-900 border border-white/15 px-3 py-2 sm:col-span-2"
              value={form.addressLine1} onChange={e=>setForm({...form, addressLine1:e.target.value})} />
            <input placeholder="City" className="rounded-lg bg-neutral-900 border border-white/15 px-3 py-2"
              value={form.city} onChange={e=>setForm({...form, city:e.target.value})} />
            <input placeholder="Notes (optional)" className="rounded-lg bg-neutral-900 border border-white/15 px-3 py-2 sm:col-span-2"
              value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} />
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-black/20 p-4">
          <h2 className="font-semibold mb-3">Payment method</h2>
          <div className="grid gap-2">
            {["COD","ESEWA","FONEPAY"].map((m)=>(
              <label key={m} className="flex items-center gap-3">
                <input type="radio" name="pay" value={m}
                  checked={form.paymentMethod===m}
                  onChange={()=>setForm({...form, paymentMethod: m as any})} />
                <span>{m==="COD" ? "Cash on Delivery" : m==="ESEWA" ? "eSewa" : "Fonepay"}</span>
              </label>
            ))}
          </div>
        </section>

        {err && <div className="text-red-300">{err}</div>}
        <button onClick={submit} disabled={submitting}
          className="rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-5 py-3 font-medium">
          {submitting ? "Placing order..." : "Place order"}
        </button>
      </div>
    </main>
  );
}