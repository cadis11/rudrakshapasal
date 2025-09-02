import { sanityFetch } from "@/lib/sanity";

function toCsvValue(v: unknown) {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\r\n]/.test(s) ? `"${s.replaceAll('"','""')}"` : s;
}

export async function GET() {
  const groq = `*[_type=="order"]|order(createdAt desc){
    orderId, status, total, phone, customerName, createdAt,
    items[]{ _key, name, qty, priceNPR }
  }`;
  const rows = await sanityFetch<any[]>(groq);

  const header = ["orderId","status","total","phone","customerName","createdAt","itemsCount"];
  const lines = [header.join(",")];

  for (const o of rows ?? []) {
    const line = [
      toCsvValue(o.orderId),
      toCsvValue(o.status),
      toCsvValue(o.total),
      toCsvValue(o.phone),
      toCsvValue(o.customerName),
      toCsvValue(o.createdAt),
      toCsvValue(Array.isArray(o.items) ? o.items.length : 0),
    ].join(",");
    lines.push(line);
  }

  const csv = lines.join("\r\n") + "\r\n";
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=\"orders.csv\"",
      "cache-control": "no-store",
    },
  });
}