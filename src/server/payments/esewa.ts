import type { PaymentProvider, CreatePaymentInput, CreatePaymentOutput } from "./provider";

const BASE = process.env.APP_URL || "http://localhost:3000";

export const eSewaProvider: PaymentProvider = {
  async createPayment({ orderId, amount, currency, returnUrl }: CreatePaymentInput): Promise<CreatePaymentOutput> {
    if (currency !== "NPR") throw new Error("eSewa supports NPR only");
    const redirectUrl = `${BASE}/api/payments/esewa/redirect?orderId=${orderId}&amt=${amount}&ret=${encodeURIComponent(returnUrl)}`;
    return { redirectUrl, providerRef: orderId };
  },
  async verify(q: Record<string,string>) {
    const orderId = q.orderId || "";
    const status = (q.status === "success") ? "success" : "failed";
    return { orderId, status };
  }
};