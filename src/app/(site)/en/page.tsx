import ProductBrowser, { } from "../../../components/ProductBrowser";
import { type CardProduct } from "../../../components/ProductCard";

async function fetchProducts(): Promise<CardProduct[]> {
  const pid   = process.env.SANITY_PROJECT_ID!;
  const ds    = process.env.SANITY_DATASET || "production";
  const ver   = process.env.SANITY_API_VERSION || "2023-10-01";
  const token = process.env.SANITY_API_TOKEN;
  const groq  = "*[_type=='product']|order(name asc){ _id,name,slug,grade,priceNPR,sizeMM,mukhi,origin, 'imageUrl': image.asset->url, description }";
  const q     = encodeURIComponent(groq);
  const url   = "https://" + pid + ".api.sanity.io/v" + ver + "/data/query/" + ds + "?query=" + q;
  const headers: HeadersInit = {};
  if (token) (headers as any).Authorization = "Bearer " + token;
  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return (data && data.result) || [];
}

export default async function Page() {
  const items = await fetchProducts();
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Rudraksha Beads</h1>
      <ProductBrowser items={items} />
    </main>
  );
}