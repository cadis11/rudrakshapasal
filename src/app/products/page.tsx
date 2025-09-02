import { permanentRedirect } from "next/navigation";

// Make this route dynamic so redirect happens at request time
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  permanentRedirect("/en/products");
}