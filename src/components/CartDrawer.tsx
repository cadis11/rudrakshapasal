"use client";
import Link from "next/link";
import { useCart, formatNPR } from "@/lib/cart";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, setQty, remove, subtotalNPR } = useCart();
  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`fixed right-0 top-0 z-[70] h-full w-full max-w-md transform bg-neutral-950 text-neutral-100 shadow-xl transition-transform duration-200 border-l border-white/10 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={onClose} className="rounded-md border border-white/15 px-2 py-1 text-sm">Close</button>
        </div>
        <div className="max-h-[65vh] overflow-auto divide-y divide-white/10">
          {state.items.length === 0 ? (
            <div className="p-6 text-neutral-300">Cart is empty. <Link href="/en" className="underline">Continue shopping</Link>.</div>
          ) : (
            state.items.map((it) => (
              <div key={it.id} className="flex items-center gap-3 p-4">
                <div className="h-16 w-16 grid place-items-center bg-neutral-900 rounded-md overflow-hidden">
                  {it.imageUrl ? <img src={it.imageUrl} alt={it.name} className="max-h-16 w-auto object-contain" /> : <div className="text-xs text-neutral-400">No image</div>}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  {typeof it.priceNPR === "number" && <div className="text-sm text-neutral-300">{formatNPR(it.priceNPR)}</div>}
                  {it.slug && <Link href={`/en/product/${it.slug}`} className="text-xs underline text-neutral-400">View</Link>}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={it.qty}
                    onChange={(e)=> setQty(it.id, Math.max(1, parseInt(e.currentTarget.value||"1",10)))}
                    className="w-16 rounded-md bg-neutral-900 border border-white/15 px-2 py-1"
                  />
                  <button onClick={()=>remove(it.id)} className="text-xs underline text-red-300">Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="border-t border-white/10 px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-neutral-300">Subtotal</span>
            <span className="text-lg font-semibold">{formatNPR(subtotalNPR)}</span>
          </div>
          <div className="flex gap-3">
            <Link href="/en/cart" className="rounded-xl border border-white/15 px-4 py-2 text-center flex-1">View cart</Link>
            <button className="rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 font-medium flex-1" disabled>Checkout (next)</button>
          </div>
        </div>
      </aside>
    </>
  );
}