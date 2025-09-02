import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function q(v: unknown){ const s = (v ?? "").toString().replace(/"/g,'""'); return `"${s}"`; }

export async function GET(req: Request){
  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to   = url.searchParams.get("to");
  const where:any = {};
  if (from || to) where.createdAt = {};
  if (from) where.createdAt.gte = new Date(from as string);
  if (to)   { const d = new Date(to as string); d.setHours(23,59,59,999); where.createdAt.lte = d; }

  const rows = await prisma.order.findMany({ where, include: { lines: true }, orderBy: { createdAt: "desc" } });
  const header = ["id","createdAt","status","name","phone","address","city","payment","totalNPR","lines"];
  const lines = rows.map(r=>{
    const items = r.lines.map(l=> `${l.slug} x${l.qty} @ NPR ${l.priceNPR}`).join("; ");
    return [q(r.id), q(r.createdAt.toISOString()), q(r.status), q(r.name), q(r.phone), q(r.address), q(r.city), q(r.payment), q(r.totalNPR), q(items)].join(",");
  });
  const csv = [header.join(","), ...lines].join("\r\n");
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=orders.csv"
    }
  });
}