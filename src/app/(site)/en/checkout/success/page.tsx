"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { track } from "@/lib/ga";

export default function Page(){
  const { items, clear } = useCart();

  useEffect(() => {
    items.forEach(({ slug }) => {
      try { localStorage.setItem(`unlock:${slug}`, "1"); } catch {}
    });
    track("purchase", { items: items.map(i => ({ slug: i.slug, qty: i.qty })) });
    clear();
  }, []);

  return (
    <main className="container py-16 space-y-6 text-center">
      <h1 className="text-3xl font-bold">Payment Successful (Demo)</h1>
      <p className="text-white/70">Your activation videos are now unlocked for purchased items.</p>
      <div className="flex gap-3 justify-center">
        <Link className="btn" href="/en">Continue shopping</Link>
        <Link className="btn" href="/en/cart">Go to cart</Link>
      </div>
    </main>
  );
}