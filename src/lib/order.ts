export type OrderItem = {
  id: string;
  slug?: string;
  name: string;
  priceNPR?: number;
  imageUrl?: string | null;
  qty: number;
};

export type Customer = {
  name: string;
  phone: string;
  email?: string;
  addressLine1: string;
  city?: string;
  notes?: string;
};

export type PaymentMethod = "COD" | "ESEWA" | "FONEPAY";
export type PaymentStatus = "initiated" | "pending" | "paid" | "failed" | "cod" | "pending_verification";
export type FulfillmentStatus = "new" | "processing" | "shipped" | "delivered" | "cancelled";

export function computeSubtotal(items: OrderItem[]): number {
  return items.reduce((s,i)=> s + (i.priceNPR ?? 0)*i.qty, 0);
}

export function computeTotals(items: OrderItem[]) {
  const subtotal = computeSubtotal(items);
  const shipping = 0; // flat for now
  const total    = subtotal + shipping;
  return { currency: "NPR", subtotal, shipping, total };
}

export function validateCustomer(c: Customer) {
  if (!c.name?.trim()) throw new Error("Name required");
  if (!c.phone?.trim()) throw new Error("Phone required");
  if (!c.addressLine1?.trim()) throw new Error("Address required");
}