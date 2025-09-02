"use server";

import { prisma } from "@/server/db";
import { eSewaProvider } from "@/server/payments/esewa";
import { getProductById } from "@/server/sanity/queries";

export async function buyNowAction(productId: string) {
  const product = await getProductById(productId);
  if (!product) throw new Error("Product not found");

  const total = Number(product.price?.amount ?? 0);
  if (!total) throw new Error("Invalid price");

  const order = await prisma.order.create({
    data: {
      status: "pending",
      currency: "NPR",
      total,
      items: {
        create: [{
          productSanityId: product._id,
          productName: product.name,
          quantity: 1,
          unitPrice: total,
        }]
      }
    }
  });

  const { redirectUrl } = await eSewaProvider.createPayment({
    orderId: order.id,
    amount: order.total,
    currency: "NPR",
    returnUrl: `${process.env.APP_URL}/en/checkout/return`,
  });

  return redirectUrl;
}