import { promises as fs } from "fs";
import path from "path";

export async function notifyStatus(order: any){
  const payload = {
    event: "order.status",
    id: order?.id,
    status: order?.status,
    contact: order?.contact,
    totalNPR: order?.totalNPR,
    createdAt: new Date().toISOString(),
  };
  // Local dev log
  try{
    const file = path.join(process.cwd(), "notifications-dev.log");
    await fs.appendFile(file, JSON.stringify(payload) + "\n", "utf8");
  }catch{}

  // Optional external webhook
  const url = process.env.NOTIFY_WEBHOOK_URL || "";
  if (url) {
    try{
      await fetch(url, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) });
    }catch{}
  }
}