import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function norm(p?: string){ return (p||"").replace(/\D+/g,""); }
function safe(o:any){
  if (!o) return null;
  const { key, ...rest } = o;
  return {
    id: rest.id,
    contact: { name: rest.name, phone: rest.phone, address: rest.address, city: rest.city, payment: rest.payment, note: rest.contactNote },
    lines: rest.lines.map((l:any)=>({ slug:l.slug, qty:l.qty, priceNPR:l.priceNPR })),
    totalNPR: rest.totalNPR,
    createdAt: rest.createdAt,
    status: rest.status,
  };
}

export async function GET(req: NextRequest){
  const url = new URL(req.url);
  const id = url.searchParams.get("id") || "";
  const k  = url.searchParams.get("k")  || "";
  if (!id || !k) return NextResponse.json({ ok:false, error:"Missing id or key" }, { status: 400 });
  const o = await prisma.order.findUnique({ where: { id } , include: { lines:true }});
  if (!o) return NextResponse.json({ ok:false, error:"Not found" }, { status: 404 });
  if (o.key !== k) return NextResponse.json({ ok:false, error:"Unauthorized" }, { status: 401 });
  return NextResponse.json({ ok:true, order: safe(o) });
}

export async function POST(req: NextRequest){
  try{
    const { id, phone } = await req.json();
    if (!id || !phone) return NextResponse.json({ ok:false, error:"Missing id or phone" }, { status: 400 });
    const o = await prisma.order.findUnique({ where: { id }, include: { lines:true }});
    if (!o) return NextResponse.json({ ok:false, error:"Not found" }, { status: 404 });
    if (norm(o.phone) !== norm(phone)) return NextResponse.json({ ok:false, error:"Phone does not match" }, { status: 401 });
    return NextResponse.json({ ok:true, order: safe(o) });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: e?.message || "Invalid request" }, { status: 400 });
  }
}