"use client";
import { useMemo, useState } from "react";
import ProductCard, { type CardProduct } from "./ProductCard";

type Props = { items: CardProduct[] };

function norm(s: string){ return s.toLowerCase(); }

export default function ProductBrowser({ items }: Props){
  const [query, setQuery] = useState("");
  const [sort, setSort]   = useState<"relevance"|"name_asc"|"price_asc"|"price_desc"|"mukhi_asc">("relevance");

  const shown = useMemo(()=>{
    let arr = items;
    const q = query.trim().toLowerCase();
    if (q) {
      arr = arr.filter(p =>
        norm(p.name).includes(q) ||
        (p.origin && norm(p.origin).includes(q)) ||
        (p.slug?.current && norm(p.slug.current).includes(q))
      );
    }
    switch (sort) {
      case "name_asc": arr = [...arr].sort((a,b)=>(a.name||"").localeCompare(b.name||"")); break;
      case "price_asc": arr = [...arr].sort((a,b)=>(a.priceNPR??1e12)-(b.priceNPR??1e12)); break;
      case "price_desc": arr = [...arr].sort((a,b)=>(b.priceNPR??-1)-(a.priceNPR??-1)); break;
      case "mukhi_asc": arr = [...arr].sort((a,b)=>(a.mukhi??1e12)-(b.mukhi??1e12)); break;
      case "relevance":
      default: /* leave as-is */ break;
    }
    return arr;
  }, [items, query, sort]);

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e)=>setQuery(e.currentTarget.value)}
          placeholder="Search name, origin, slug…"
          className="w-full sm:w-72 rounded-xl bg-neutral-900 border border-white/15 px-3 py-2"
        />
        <div className="flex items-center gap-2 text-sm text-neutral-300">
          <span className="opacity-70">Sort</span>
          <select
            value={sort}
            onChange={(e)=>setSort(e.currentTarget.value as any)}
            className="rounded-xl bg-neutral-900 border border-white/15 px-2 py-1">
            <option value="relevance">Relevance</option>
            <option value="name_asc">Name A→Z</option>
            <option value="price_asc">Price Low→High</option>
            <option value="price_desc">Price High→Low</option>
            <option value="mukhi_asc">Mukhi Low→High</option>
          </select>
        </div>
      </div>
      <div className="text-sm text-neutral-400 mb-2">{shown.length} result(s)</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {shown.map((p) => <ProductCard key={p._id} p={p} />)}
      </div>
    </>
  );
}