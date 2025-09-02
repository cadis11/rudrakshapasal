import { NextResponse } from "next/server";

export async function GET(_req: Request, ctx: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await ctx.params;

  const pid   = process.env.SANITY_PROJECT_ID!;
  const ds    = process.env.SANITY_DATASET || "production";
  const ver   = process.env.SANITY_API_VERSION || "2023-10-01";

  const groq = `*[_type=="order" && orderId=="${orderId}"][0]`;
  const url  = `https://${pid}.api.sanity.io/v${ver}/data/query/${ds}?query=${encodeURIComponent(groq)}`;
  const res  = await fetch(url, { cache: "no-store" });
  if (!res.ok) return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  const data = await res.json();
  return NextResponse.json(data?.result ?? null);
}