"use client";
import { useState } from "react";
type Line = { slug:string; qty:number; priceNPR:number };
type Contact = { name:string; phone:string; address:string; city:string; payment:string; note?:string };
type Order = { id:string; contact:Contact; lines:Line[]; totalNPR:number; createdAt:string; status?:string };

function Badge({ s }:{ s?:string }){
  const cls = (s||"Pending").toLowerCase();
  return <span className={`rp-badge rp-badge--${cls}`} style={{textTransform:"capitalize"}}>{s||"Pending"}</span>;
}

export default function TrackPage(){
  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <main className="rp-container" style={{paddingTop:"1.5rem", paddingBottom:"2rem"}}>
      <h1 style={{fontSize:"1.6rem", fontWeight:800, marginBottom:"1rem"}}>Track your order</h1>
      <form className="rp-card" style={{padding:"1rem", display:"grid", gap:".5rem"}}
        onSubmit={async e => {
          e.preventDefault(); setErr(null); setOrder(null); setBusy(true);
          try{
            const res = await fetch("/api/track", {
              method:"POST", headers:{"Content-Type":"application/json"},
              body: JSON.stringify({ id, phone })
            });
            const json = await res.json();
            if (!res.ok || !json?.ok) throw new Error(json?.error || "Not found");
            setOrder(json.order);
          }catch(e:any){ setErr(e?.message || "Failed"); }
          finally{ setBusy(false); }
        }}>
        <div style={{display:"grid", gap:".5rem"}}>
          <input className="rp-card rp-input" placeholder="Order ID" value={id} onChange={e=>setId(e.target.value)} required />
          <input className="rp-card rp-input" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} required inputMode="tel" />
        </div>
        {err ? <div style={{color:"#fca5a5"}}>{err}</div> : null}
        <div style={{display:"flex", gap:".75rem", marginTop:".5rem"}}>
          <button className="rp-btn rp-btn--primary" disabled={busy}>{busy ? "Checking…" : "Check status"}</button>
          <a className="rp-btn" href="/en">Back to shop</a>
        </div>
      </form>

      {order ? (
        <div className="rp-card" style={{padding:"1rem", marginTop:"1rem"}}>
          <div style={{display:"flex", justifyContent:"space-between", gap:"1rem", flexWrap:"wrap"}}>
            <div>
              <div style={{fontWeight:700}}>#{order.id}</div>
              <div className="rp-muted" style={{fontSize:".9rem"}}>{new Date(order.createdAt).toLocaleString()}</div>
            </div>
            <div style={{display:"flex", gap:".5rem", alignItems:"center"}}>
              <strong>Status:</strong> <Badge s={order.status} />
            </div>
          </div>

          <hr className="rp-divider" style={{margin:".75rem 0"}} />
          <div style={{display:"grid", gap:".25rem"}}>
            <div><strong>Name:</strong> {order.contact?.name || "—"}</div>
            <div><strong>Address:</strong> {order.contact?.address || "—"}, {order.contact?.city || "—"}</div>
            <div><strong>Phone:</strong> {order.contact?.phone || "—"}</div>
            <div><strong>Payment:</strong> {order.contact?.payment || "—"}</div>
          </div>

          <div style={{marginTop:".75rem"}}>
            <strong>Items</strong>
            <ul style={{marginTop:".25rem", display:"grid", gap:".25rem"}}>
              {order.lines?.map((l, i) => (
                <li key={i} className="rp-muted" style={{fontSize:".95rem"}}>
                  {l.slug} — {l.qty} × NPR {Number(l.priceNPR||0).toLocaleString("en-NP")}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </main>
  );
}