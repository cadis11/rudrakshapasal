"use client";
import { useEffect, useMemo, useState } from "react";
type Line = { slug:string; qty:number; priceNPR:number };
type Contact = { name:string; phone:string; address:string; city:string; payment:string; note?:string };
type Order = { id:string; contact:Contact; lines:Line[]; totalNPR:number; createdAt:string; status?:string };

function fmtDateInput(d: Date){ return d.toISOString().slice(0,10); }

export default function Reports(){
  const [orders, setOrders] = useState<Order[]>([]);
  const [from, setFrom] = useState<string>(fmtDateInput(new Date(Date.now()-30*864e5)));
  const [to,   setTo]   = useState<string>(fmtDateInput(new Date()));
  const [busy, setBusy] = useState(false);

  async function load(){
    setBusy(true);
    const url = `/api/orders?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
    const res = await fetch(url, { cache:"no-store" });
    const arr = await res.json();
    setOrders(Array.isArray(arr) ? arr : []);
    setBusy(false);
  }
  useEffect(()=>{ load() },[]);

  const stats = useMemo(()=>{
    const count = orders.length;
    const revenue = orders.reduce((s,o)=> s + Number(o.totalNPR||0), 0);
    const items = orders.reduce((s,o)=> s + (o.lines||[]).reduce((a,l)=> a + Number(l.qty||0), 0), 0);
    const deliveredRevenue = orders.filter(o=>o.status==="Delivered").reduce((s,o)=> s + Number(o.totalNPR||0), 0);
    const byProduct = new Map<string, number>();
    for (const o of orders) for (const l of (o.lines||[])) byProduct.set(l.slug, (byProduct.get(l.slug)||0) + Number(l.qty||0));
    const top = [...byProduct.entries()].sort((a,b)=> b[1]-a[1]).slice(0,5);
    return { count, revenue, items, aov: count ? revenue/count : 0, deliveredRevenue, top };
  },[orders]);

  const csvHref = `/api/orders.csv?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

  return (
    <main className="rp-container" style={{paddingTop:"1.25rem", paddingBottom:"2rem"}}>
      <header style={{display:"grid", gridTemplateColumns:"1fr auto auto auto auto", gap:".5rem", alignItems:"end", marginBottom:"1rem"}}>
        <div><h1 style={{fontSize:"1.5rem", fontWeight:800}}>Reports</h1><p className="rp-muted">{busy ? "Loading…" : `${orders.length} orders in range`}</p></div>
        <input className="rp-card rp-input" type="date" value={from} onChange={e=>setFrom(e.target.value)} />
        <input className="rp-card rp-input" type="date" value={to}   onChange={e=>setTo(e.target.value)} />
        <button className="rp-btn" onClick={load} disabled={busy}>Apply</button>
        <a className="rp-btn rp-btn--primary" href={csvHref} target="_blank">Export CSV</a>
      </header>

      <section style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"1rem"}}>
        <div className="rp-card" style={{padding:"1rem"}}><div className="rp-muted">Revenue (NPR)</div><div style={{fontSize:"1.8rem", fontWeight:900}}>{stats.revenue.toLocaleString("en-NP")}</div></div>
        <div className="rp-card" style={{padding:"1rem"}}><div className="rp-muted">Orders</div><div style={{fontSize:"1.8rem", fontWeight:900}}>{stats.count}</div></div>
        <div className="rp-card" style={{padding:"1rem"}}><div className="rp-muted">AOV (NPR)</div><div style={{fontSize:"1.8rem", fontWeight:900}}>{Math.round(stats.aov).toLocaleString("en-NP")}</div></div>
        <div className="rp-card" style={{padding:"1rem"}}><div className="rp-muted">Items sold</div><div style={{fontSize:"1.8rem", fontWeight:900}}>{stats.items}</div></div>
        <div className="rp-card" style={{padding:"1rem"}}><div className="rp-muted">Delivered revenue</div><div style={{fontSize:"1.8rem", fontWeight:900}}>{stats.deliveredRevenue.toLocaleString("en-NP")}</div></div>
      </section>

      <section className="rp-card" style={{padding:"1rem", marginTop:"1rem"}}>
        <h2 style={{fontWeight:700}}>Top products</h2>
        <ol style={{marginTop:".5rem", display:"grid", gap:".25rem"}}>
          {stats.top.map(([slug, qty]) => (
            <li key={slug} className="rp-muted" style={{fontSize:".95rem"}}>{slug} — {qty}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}