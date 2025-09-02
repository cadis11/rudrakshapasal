"use client";
import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

export type CartItem = { id: string; slug?: string; name: string; priceNPR?: number; imageUrl?: string | null; qty: number; };
type CartState = { items: CartItem[] };
type Action =
  | { type: "ADD"; item: Omit<CartItem,"qty">; qty?: number }
  | { type: "REMOVE"; id: string }
  | { type: "SET_QTY"; id: string; qty: number }
  | { type: "CLEAR" };

const CartContext = createContext<{
  state: CartState; add: (item: Omit<CartItem,"qty">, qty?: number) => void;
  remove: (id: string) => void; setQty: (id: string, qty: number) => void;
  clear: () => void; subtotalNPR: number;
} | null>(null);

function reducer(state: CartState, a: Action): CartState {
  switch(a.type){
    case "ADD": {
      const qty = Math.max(1, a.qty ?? 1);
      const i = state.items.findIndex(x => x.id === a.item.id);
      if (i >= 0){ const items = [...state.items]; items[i] = { ...items[i], qty: items[i].qty + qty }; return { items }; }
      return { items: [...state.items, { ...a.item, qty }] };
    }
    case "REMOVE": return { items: state.items.filter(i => i.id !== a.id) };
    case "SET_QTY": {
      const items = state.items.map(i => i.id === a.id ? { ...i, qty: Math.max(0, a.qty) } : i).filter(i => i.qty > 0);
      return { items };
    }
    case "CLEAR": return { items: [] };
    default: return state;
  }
}

const KEY = "rp_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.items)) {
        parsed.items.forEach((it: any) => {
          if (!it?.id || !it?.name) return;
          dispatch({ type: "ADD", item: { id: it.id, name: it.name, slug: it.slug, priceNPR: it.priceNPR, imageUrl: it.imageUrl }, qty: it.qty ?? 1 });
        });
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const subtotalNPR = useMemo(() => state.items.reduce((s,i)=> s + (i.priceNPR ?? 0) * i.qty, 0), [state.items]);

  const value = useMemo(() => ({
    state,
    add: (item: Omit<CartItem,"qty">, qty?: number) => dispatch({ type: "ADD", item, qty }),
    remove: (id: string) => dispatch({ type: "REMOVE", id }),
    setQty: (id: string, qty: number) => dispatch({ type: "SET_QTY", id, qty }),
    clear: () => dispatch({ type: "CLEAR" }),
    subtotalNPR,
  }), [state, subtotalNPR]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(){ const c = useContext(CartContext); if(!c) throw new Error("useCart must be used within CartProvider"); return c; }

export function formatNPR(n?: number){ if(typeof n!=="number") return ""; return new Intl.NumberFormat("en-NP",{style:"currency",currency:"NPR",maximumFractionDigits:0}).format(n); }