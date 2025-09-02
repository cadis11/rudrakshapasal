import { NextResponse } from "next/server";
import { sanityFetch } from "@/lib/sanity";

// GET /api/track?id=RP-XXXX
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") || searchParams.get("orderId");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const groq = `*[_type=="order" && orderId==$id][0]{
    orderId, status, total, phone, customerName, createdAt,
    items[]{ _key, name, qty, priceNPR }
  }`;

  const order = await sanityFetch<any>(groq, { id });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, order });
}

// POST /api/track  body: { id: "RP-XXXX" }
export async function POST(req: Request) {
  let body: any = {};
  try { body = await req.json(); } catch {}
  const id = body?.id || body?.orderId;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const groq = `*[_type=="order" && orderId==$id][0]{
    orderId, status, total, phone, customerName, createdAt,
    items[]{ _key, name, qty, priceNPR }
  }`;

  const order = await sanityFetch<any>(groq, { id });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, order });
}