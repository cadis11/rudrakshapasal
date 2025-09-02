"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import CartDrawer from "@/components/CartDrawer";

export default function SiteHeader(){
  const { state } = useCart();
  const [open, setOpen] = useState(false);
  const count = state.items.reduce((n,i)=>n+i.qty,0);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/en" className="font-semibold tracking-tight no-underline hover:underline">Rudraksha-Pasal</Link>
          <nav className="flex items-center gap-4">
            <Link href="/en" className="opacity-80 hover:opacity-100 no-underline hover:underline">Products</Link>
            <button onClick={()=>setOpen(true)} className="opacity-80 hover:opacity-100 no-underline hover:underline">
              Cart <span className="ml-1 rounded-full bg-amber-500 text-black text-xs px-2 py-0.5">{count}</span>
            </button>
          </nav>
        </div>
      </header>
      <CartDrawer open={open} onClose={()=>setOpen(false)} />
    </>
  );
}