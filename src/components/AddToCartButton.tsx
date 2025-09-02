"use client";
import { useState } from "react";
import { useCart, formatNPR } from "@/lib/cart";

type Props = { id: string; slug?: string; name: string; priceNPR?: number; imageUrl?: string | null; size?: "sm"|"lg" };
export default function AddToCartButton({ id, slug, name, priceNPR, imageUrl, size="sm" }: Props){
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function onClick(){
    add({ id, slug, name, priceNPR, imageUrl }, 1);
    setAdded(true);
    setTimeout(()=>setAdded(false), 1200);
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={onClick}
        className={size==="lg"
          ? "rounded-xl px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-medium transition"
          : "rounded-xl bg-amber-500/90 text-black px-3 py-1.5 text-sm"}
        aria-label={`Add ${name} to cart`}>
        Add to cart{typeof priceNPR==="number" ? ` • ${formatNPR(priceNPR)}` : ""}
      </button>
      {added && (
        <span className="absolute -top-2 -right-2 rounded-full bg-emerald-500 text-black text-[10px] px-2 py-0.5 shadow">
          Added
        </span>
      )}
    </div>
  );
}