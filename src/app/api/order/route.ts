import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";

function newId(){ try{ return crypto.randomUUID() }catch{ return Math.random().toString(36).slice(2) } }
function newKey(){ return crypto.randomBytes(8).toString("hex") }

export async function POST(req: NextRequest){
  try{
    const body = await req.json();
    const { contact, lines } = body as { contact?: any; lines?: any[] };
    const id = newId();
    const key = newKey();
    const createdAt = new Date();

    const safeLines = Array.isArray(lines) ? lines : [];
    const totalNPR = safeLines.reduce((s, l:any) => s + (Number(l.priceNPR||0) * Number(l.qty||0)), 0);

    const order = await prisma.order.create({
      data: {
        id, key, createdAt,
        name: contact?.name || null,
        phone: contact?.phone || null,
        address: contact?.address || null,
        city: contact?.city || null,
        payment: contact?.payment || null,
        contactNote: contact?.note || null,
        adminNote: "",
        status: "Pending",
        totalNPR,
        lines: { create: safeLines.map((l:any)=> ({ slug: String(l.slug), qty: Number(l.qty||0), priceNPR: Number(l.priceNPR||0) })) },
        history: { create: [{ status: "Pending", at: createdAt }] },
      },
      include: { lines: true },
    });

    const trackUrl = `/en/track/${id}?k=${key}`;
    return NextResponse.json({ ok:true, id: order.id, trackUrl, status: order.status });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: e?.message || "Invalid request" }, { status: 400 });
  }
}