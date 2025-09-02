"use client";
import { useCart } from "@/lib/cart";
export default function BuyButtons({ slug }:{ slug:string }){
  const { add } = useCart();
  return (
    <div className="flex gap-3">
      <button className="btn" onClick={()=>add(slug,1)}>Add to cart</button>
      <a className="btn" href="/en/cart">Go to cart</a>
    </div>
  );
}