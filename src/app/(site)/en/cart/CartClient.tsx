"use client";
import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import ImageWithFallback from "@/components/ImageWithFallback";
import { useRouter } from "next/navigation";

type CatalogItem = { slug: string; name?: string; priceNPR?: number; image?: string | null };
type Props = { catalog: CatalogItem[] };

export default function CartClient({ catalog }: Props){
  const { items, add, remove, clear } = useCart();
  const router = useRouter();

  const map = useMemo(() => {
    const m = new Map<string, CatalogItem>();
    for (const p of catalog) m.set(p.slug, p);
    return m;
  }, [catalog]);

  const lines = items.map(it => {
    const p = map.get(it.slug);
    const price = (p?.priceNPR && Number.isFinite(p.priceNPR)) ? p.priceNPR : 0;
    const subtotal = price * it.qty;
    return { slug: it.slug, qty: it.qty, p, price, subtotal };
  });
  const total = lines.reduce((s,l)=> s + l.subtotal, 0);

  // Checkout form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [payment, setPayment] = useState<"Khalti"|"eSewa"|"COD">("COD");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="rp-card" style={{padding:"1.25rem"}}>
        <p className="rp-muted">Your cart is empty.</p>
        <div style={{marginTop:".75rem"}}><a href="/en" className="rp-btn rp-btn--primary">Continue shopping</a></div>
      </div>
    );
  }

  return (
    <div style={{display:"grid", gap:"1.25rem", gridTemplateColumns:"1fr", alignItems:"start"}}>
      {/* Lines */}
      <div className="rp-card" style={{padding:"1rem"}}>
        <div style={{display:"grid", gap:"0.75rem"}}>
          {lines.map((l) => (
            <div key={l.slug} style={{display:"grid", gridTemplateColumns:"88px 1fr auto", gap:"0.75rem", alignItems:"center"}}>
              <div className="rp-square" style={{width:"88px", height:"88px", aspectRatio:"1 / 1"}}>
                <ImageWithFallback src={l.p?.image || "/placeholder.svg"} alt={l.p?.name || "Product"} />
              </div>
              <div>
                <div style={{fontWeight:600}}>{l.p?.name || l.slug}</div>
                <div className="rp-muted" style={{fontSize:".9rem"}}>NPR {l.price.toLocaleString("en-NP")} × {l.qty}</div>
                <div style={{display:"flex", gap:".5rem", marginTop:".4rem"}}>
                  <button className="rp-btn" onClick={()=> l.qty>1 ? add(l.slug, -1) : remove(l.slug)}>-</button>
                  <span className="rp-btn" style={{pointerEvents:"none"}}>{l.qty}</span>
                  <button className="rp-btn" onClick={()=> add(l.slug, 1)}>+</button>
                  <button className="rp-btn" onClick={()=> remove(l.slug)}>Remove</button>
                </div>
              </div>
              <div style={{fontWeight:700}}>NPR {l.subtotal.toLocaleString("en-NP")}</div>
            </div>
          ))}
        </div>
        <hr className="rp-divider" style={{margin:"1rem 0"}} />
        <div style={{display:"flex", justifyContent:"space-between", fontSize:"1.1rem"}}>
          <span>Total</span>
          <strong>NPR {total.toLocaleString("en-NP")}</strong>
        </div>
      </div>

      {/* Checkout */}
      <form
        className="rp-card"
        style={{padding:"1rem", display:"grid", gap:".75rem"}}
        onSubmit={async (e)=> {
          e.preventDefault();
          setErr(null); setBusy(true);
          try{
            const res = await fetch("/api/order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contact: { name, phone, address, city, payment, note },
                lines: lines.map(l => ({ slug: l.slug, qty: l.qty, priceNPR: l.price })),
                totalNPR: total
              })
            });
            const json = await res.json();
            if (!res.ok || !json?.id) throw new Error(json?.error || "Order failed");
            clear();
            router.push(`/en/thanks/${json.id}`);
          }catch(err:any){
            setErr(err?.message || "Failed to place order");
          }finally{
            setBusy(false);
          }
        }}
      >
        <h2 style={{fontWeight:700}}>Checkout</h2>

        <div style={{display:"grid", gap:".5rem"}}>
          <input required placeholder="Full name"  value={name}    onChange={e=>setName(e.target.value)}     className="rp-card rp-input" />
          <input required placeholder="Phone"      value={phone}   onChange={e=>setPhone(e.target.value)}    className="rp-card rp-input" inputMode="tel" />
          <input required placeholder="Address"    value={address} onChange={e=>setAddress(e.target.value)}  className="rp-card rp-input" />
          <input required placeholder="City"       value={city}    onChange={e=>setCity(e.target.value)}     className="rp-card rp-input" />
          <select value={payment} onChange={e=>setPayment(e.target.value as any)} className="rp-card rp-input">
            <option value="COD">Cash on Delivery</option>
            <option value="Khalti">Khalti (sandbox)</option>
            <option value="eSewa">eSewa (sandbox)</option>
          </select>
          <textarea placeholder="Notes (optional)" value={note} onChange={e=>setNote(e.target.value)} rows={3} className="rp-card rp-input"></textarea>
        </div>

        {err ? <div style={{color:"#fca5a5"}}>{err}</div> : null}

        <div style={{display:"flex", gap:".75rem", marginTop:".5rem"}}>
          <button type="submit" className="rp-btn rp-btn--primary" disabled={busy}>{busy ? "Placing…" : "Place order"}</button>
          <button type="button" className="rp-btn" onClick={()=>clear()}>Clear cart</button>
        </div>
      </form>
    </div>
  );
}