"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";
export default function CartBadge(){
  const { count } = useCart();
  return (
    <Link href="/en/cart" className="relative btn">
      Cart <span className="ml-2 inline-flex items-center justify-center rounded-full min-w-6 h-6 text-xs bg-white/10 px-2">{count}</span>
    </Link>
  );
}