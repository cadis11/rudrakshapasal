"use client";
import Link from "next/link";
import { useCart, formatNPR } from "@/lib/cart";

export default function CartPage(){
  const { state, setQty, remove, clear, subtotalNPR } = useCart();
  const items = state.items;
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <div className="text-neutral-300">
          Your cart is empty. <Link href="/en" className="underline">Continue shopping</Link>.
        </div>
      ) : (
        <>
          <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-black/20">
            {items.map((it) => (
              <div key={it.id} className="p-4 flex gap-4 items-center">
                <div className="relative w-20 h-20 bg-neutral-900 rounded-md overflow-hidden grid place-items-center">
                  {it.imageUrl ? <img src={it.imageUrl} alt={it.name} className="max-h-20 w-auto object-contain" /> : <div className="text-xs text-neutral-400">No image</div>}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  {typeof it.priceNPR === "number" && (<div className="text-sm text-neutral-300">{formatNPR(it.priceNPR)}</div>)}
                  {it.slug && (<Link className="text-xs underline text-neutral-400" href={`/en/product/${it.slug}`}>View</Link>)}
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" min={1} value={it.qty} onChange={(e)=>setQty(it.id, Math.max(1, parseInt(e.currentTarget.value||"1",10)))} className="w-16 rounded-md bg-neutral-900 border border-white/15 px-2 py-1" />
                  <button onClick={()=>remove(it.id)} className="text-sm underline text-red-300">Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-lg">Subtotal: <span className="font-semibold">{formatNPR(subtotalNPR)}</span></div>
            <div className="flex gap-3">
              <button onClick={()=>clear()} className="rounded-xl border border-white/15 px-4 py-2">Clear</button>
              <Link href="/en/checkout" className="rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-5 py-2 font-medium">Checkout</Link>
            </div>
          </div>
        </>
      )}
    </main>
  );
}