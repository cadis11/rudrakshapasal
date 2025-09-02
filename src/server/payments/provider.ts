export type CreatePaymentInput = {
  orderId: string;
  amount: number;           // minor units
  currency: "NPR" | "USD";
  returnUrl: string;
};
export type CreatePaymentOutput = { redirectUrl: string; providerRef: string; };

export interface PaymentProvider {
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentOutput>;
  verify(query: Record<string,string>): Promise<{ orderId: string; status: "success"|"failed" }>;
}