import { permanentRedirect } from "next/navigation";

// prevent prerender so the redirect happens at request time
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  permanentRedirect("/owner-panel/owner-panel/owner-panel/orders");
}