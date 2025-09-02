"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  id: string;          // product _id
  title: string;
  price: number;
  qty: number;
  imageUrl?: string | null;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) => {
        const items = [...get().items];
        const i = items.findIndex(x => x.id === item.id);
        if (i >= 0) items[i] = { ...items[i], qty: Math.min(99, items[i].qty + qty) };
        else items.push({ ...item, qty });
        set({ items });
      },
      remove: (id) => set({ items: get().items.filter(x => x.id !== id) }),
      setQty: (id, qty) => {
        const items = get().items.map(x => x.id === id ? { ...x, qty: Math.max(1, Math.min(99, qty)) } : x);
        set({ items });
      },
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
      count: () => get().items.reduce((s, i) => s + i.qty, 0),
    }),
    {
      name: "rp-cart",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);