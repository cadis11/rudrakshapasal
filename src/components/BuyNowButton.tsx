"use client";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";

export function BuyNowButton(props: { id: string; title: string; price: number; imageUrl?: string | null }) {
  const router = useRouter();
  const add = useCart(s => s.add);
  const clear = useCart(s => s.clear);

  return (
    <button
      onClick={() => {
        clear();
        add({ id: props.id, title: props.title, price: props.price, imageUrl: props.imageUrl }, 1);
        router.push("/en/checkout");
      }}
      className="mt-3 inline-flex rounded-xl border px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
    >
      Buy now
    </button>
  );
}