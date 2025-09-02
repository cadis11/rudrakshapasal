"use client";
import { useTransition } from "react";
import { buyNowAction } from "@/server/actions/checkout";

export function BuyNow({ productId }: { productId: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => start(async () => {
        const url = await buyNowAction(productId);
        window.location.href = url;
      })}
      className="px-4 py-2 rounded-lg bg-black text-white"
      aria-busy={pending}
    >
      {pending ? "Redirecting…" : "Buy Now"}
    </button>
  );
}