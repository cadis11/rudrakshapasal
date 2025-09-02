import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function inRangeParams(url: URL){
  const from = url.searchParams.get("from");
  const to   = url.searchParams.get("to");
  const where:any = {};
  if (from || to) where.createdAt = {};
  if (from) where.createdAt.gte = new Date(from as string);
  if (to)   { const d = new Date(to as string); d.setHours(23,59,59,999); where.createdAt.lte = d; }
  return where;
}
function shape(o:any){
  return {
    id: o.id,
    contact: { name:o.name, phone:o.phone, address:o.address, city:o.city, payment:o.payment, note:o.contactNote },
    lines: o.lines.map((l:any)=>({ slug:l.slug, qty:l.qty, priceNPR:l.priceNPR })),
    totalNPR: o.totalNPR,
    createdAt: o.createdAt,
    status: o.status,
    adminNote: o.adminNote,
  };
}

export async function GET(req: Request){
  const url = new URL(req.url);
  const where = inRangeParams(url);
  const rows = await prisma.order.findMany({
    where,
    include: { lines: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(rows.map(shape));
}