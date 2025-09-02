"use client";
import { useEffect, useMemo, useState } from "react";

type Line = { slug:string; qty:number; priceNPR:number };
type Contact = { name:string; phone:string; address:string; city:string; payment:string; note?:string };
type Order = { id:string; key?:string; contact:Contact; lines:Line[]; totalNPR:number; createdAt:string; status?:string; statusHistory?:{status:string; at:string}[]; adminNote?:string };

const STATUSES = ["Pending","Processing","Packed","Shipped","Delivered","Cancelled"] as const;
function Badge({ s }:{ s?:string }){ const cls = (s||"Pending").toLowerCase(); return <span className={`rp-badge rp-badge--${cls}`} style={{textTransform:"capitalize"}}>{s||"Pending"}</span>; }

export default function OrderPage({ params }:{ params: Promise<{ id:string }> }){
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<string>("Pending");
  const [note, setNote] = useState<string>("");
  const [notify, setNotify] = useState<boolean>(true);
  const [id, setId] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(()=>{
    (async ()=>{
      const { id } = await params; setId(id);
      const res = await fetch(`/api/orders/${id}`, { cache:"no-store" });
      const json = await res.json();
      if (!res.ok || !json?.ok) { setErr(json?.error || "Not found"); return; }
      const o = json.order as Order;
      setOrder(o); setStatus(o.status || "Pending"); setNote(o.adminNote || "");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  async function save(newStatus?: string){
    if (!id) return; setBusy(true); setErr(null);
    try{
      const res = await fetch(`/api/orders/${id}`, { method:"PATCH", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ status: newStatus ?? status, adminNote: note, notify }) });
      const json = await res.json();
      if (!res.ok || !json?.ok) throw new Error(json?.error || "Failed");
      const o = json.order as Order; setOrder(o); setStatus(o.status || "Pending");
    }catch(e:any){ setErr(e?.message || "Failed"); }
    finally{ setBusy(false); }
  }

  const trackUrl = useMemo(()=> order?.key ? `/en/track/${order.id}?k=${order.key}` : null, [order]);

  if (!order) return <main className="rp-container" style={{paddingTop:"1.25rem", paddingBottom:"2rem"}}>{err ? <div className="rp-card" style={{padding:"1rem", color:"#fca5a5"}}>{err}</div> : <div className="rp-muted">Loading…</div>}</main>;

  return (
    <main className="rp-container" style={{paddingTop:"1.25rem", paddingBottom:"2rem"}}>
      <div className="rp-card" style={{padding:"1rem", display:"grid", gap:".75rem"}}>
        <div style={{display:"flex", justifyContent:"space-between", gap:"1rem", flexWrap:"wrap", alignItems:"center"}}>
          <div>
            <h1 style={{fontSize:"1.25rem", fontWeight:800}}>Order #{order.id}</h1>
            <div className="rp-muted" style={{fontSize:".9rem"}}>{new Date(order.createdAt).toLocaleString()}</div>
          </div>
          <div style={{display:"flex", gap:".5rem", alignItems:"center"}}>
            <Badge s={status} />
            <select className="rp-card rp-input" value={status} onChange={e=>setStatus(e.target.value)}>
              {STATUSES.map(s=> <option key={s} value={s}>{s}</option>)}
            </select>
            <label className="rp-btn"><input type="checkbox" checked={notify} onChange={e=>setNotify(e.target.checked)} /> Notify</label>
            <button className="rp-btn rp-btn--primary" onClick={()=>save()} disabled={busy}>{busy ? "Saving…" : "Save"}</button>
            <button className="rp-btn" onClick={()=>save("Delivered")} disabled={busy}>Mark delivered</button>
          </div>
        </div>

        <hr className="rp-divider" />

        <div style={{display:"grid", gap:".5rem", gridTemplateColumns:"1fr", alignItems:"start"}}>
          <div className="rp-card" style={{padding:"1rem"}}>
            <strong>Customer</strong>
            <div className="rp-muted" style={{marginTop:".25rem"}}>
              <div>{order.contact?.name || "—"}</div>
              <div>{order.contact?.address || "—"}, {order.contact?.city || "—"}</div>
              <div>Phone: {order.contact?.phone || "—"}</div>
              <div>Payment: {order.contact?.payment || "—"}</div>
            </div>
            {trackUrl ? (
              <div style={{marginTop:".5rem", display:"flex", gap:".5rem"}}>
                <a className="rp-btn" href={trackUrl} target="_blank">Open track link</a>
                <button className="rp-btn" onClick={()=> { navigator.clipboard?.writeText(location.origin + trackUrl) }}>Copy track link</button>
              </div>
            ) : null}
          </div>

          <div className="rp-card" style={{padding:"1rem"}}>
            <strong>Items</strong>
            <ul style={{marginTop:".25rem", display:"grid", gap:".25rem"}}>
              {order.lines?.map((l, i) => (
                <li key={i} className="rp-muted" style={{fontSize:".95rem"}}>
                  {l.slug} — {l.qty} × NPR {Number(l.priceNPR||0).toLocaleString("en-NP")}
                </li>
              ))}
            </ul>
            <div style={{display:"flex", justifyContent:"space-between", marginTop:".5rem"}}>
              <span>Total</span>
              <strong>NPR {Number(order.totalNPR||0).toLocaleString("en-NP")}</strong>
            </div>
          </div>

          <div className="rp-card" style={{padding:"1rem"}}>
            <strong>Internal note</strong>
            <textarea className="rp-card rp-input" rows={4} value={note} onChange={e=>setNote(e.target.value)} placeholder="Private notes (customer cannot see)"></textarea>
            <div style={{marginTop:".5rem"}}>
              <button className="rp-btn rp-btn--primary" onClick={()=>save()} disabled={busy}>{busy ? "Saving…" : "Save note"}</button>
            </div>
          </div>

          <div className="rp-card" style={{padding:"1rem"}}>
            <strong>Status history</strong>
            <ul style={{marginTop:".25rem", display:"grid", gap:".25rem"}}>
              {(order.statusHistory || [{status: order.status || "Pending", at: order.createdAt}]).map((h,i)=>(
                <li key={i} className="rp-muted" style={{fontSize:".95rem"}}>{h.status} — {new Date(h.at).toLocaleString()}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div style={{marginTop:".75rem"}}><a className="rp-btn" href="../">← Back to orders</a></div>
    </main>
  );
}