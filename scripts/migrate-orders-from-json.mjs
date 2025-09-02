import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function norm(p){ return (p||"").toString(); }
function asInt(x){ const n = Number(x||0); return Number.isFinite(n) ? Math.round(n) : 0; }

async function run(){
  const file = "./orders-dev.json";
  if (!existsSync(file)) { console.log("No orders-dev.json found. Nothing to import."); process.exit(0); }
  const txt = await readFile(file, "utf8");
  let arr = [];
  try { arr = JSON.parse(txt) } catch { arr = [] }
  if (!Array.isArray(arr) || arr.length===0) { console.log("No orders to import."); process.exit(0); }

  let ok = 0, skip = 0;
  for (const r of arr){
    try{
      const existing = await prisma.order.findUnique({ where: { id: r.id } });
      if (existing) { skip++; continue; }
      const contact = r.contact || {};
      const createdAt = r.createdAt ? new Date(r.createdAt) : new Date();
      const status = r.status || "Pending";
      await prisma.order.create({
        data: {
          id: norm(r.id),
          key: norm(r.key || Math.random().toString(16).slice(2)),
          name: norm(contact.name),
          phone: norm(contact.phone),
          address: norm(contact.address),
          city: norm(contact.city),
          payment: norm(contact.payment),
          contactNote: norm(contact.note),
          adminNote: norm(r.adminNote),
          totalNPR: asInt(r.totalNPR),
          status,
          createdAt,
          lines: { create: (r.lines||[]).map(l => ({ slug:norm(l.slug), qty:asInt(l.qty), priceNPR:asInt(l.priceNPR) })) },
          history: { create: (r.statusHistory||[{status, at: createdAt}]).map(h=>({ status: norm(h.status), at: new Date(h.at||createdAt) })) }
        }
      });
      ok++;
    }catch(e){
      console.error("Import failed for", r?.id, e?.message);
    }
  }
  console.log(`Imported ${ok} order(s). Skipped ${skip} existing.`);
  process.exit(0);
}

run().finally(()=> prisma.$disconnect());