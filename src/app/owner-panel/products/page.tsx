import { getProducts } from "@/lib/products";
export const dynamic = "force-dynamic";
export default async function AdminProducts(){
  const items = await getProducts();
  const studioBase = process.env.NEXT_PUBLIC_STUDIO_BASEPATH || "/admin";
  return (
    <div style={{display:"grid", gap:"1rem"}}>
      <header style={{display:"flex", justifyContent:"space-between", alignItems:"end", gap:"1rem"}}>
        <div><h1 style={{fontSize:"1.25rem", fontWeight:800}}>Products</h1><p className="rp-muted" style={{marginTop:".25rem"}}>{items.length} item(s)</p></div>
        <a className="rp-btn rp-btn--primary" href={studioBase}>Open Studio</a>
      </header>
      <div className="rp-card" style={{padding:"1rem"}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr auto", gap:".5rem .75rem", alignItems:"center"}}>
          {items.map(p => (
            <div key={p.slug} style={{display:"contents"}}>
              <div><div style={{fontWeight:600}}>{p.name}</div><div className="rp-muted" style={{fontSize:".9rem"}}>{p.slug} • NPR {Number(p.priceNPR||0).toLocaleString("en-NP")}</div></div>
              <div><a className="rp-btn" href={studioBase}>Edit in Studio</a></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}