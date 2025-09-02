import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId")!;
  const ret = searchParams.get("ret")!;
  // we still accept "amt" in the URL but we don't need to bind it here
  const back = new URL(ret);
  back.searchParams.set("orderId", orderId);
  back.searchParams.set("status", "success");
  return NextResponse.redirect(back.toString(), { status: 302 });
}