import { client } from "./client";
import { hasSanityEnv } from "./env";
import { imageUrl, type SanityImageSource } from "@/lib/sanity/image";

export interface ProductListItem {
  _id: string;
  name: string;
  slug: string;
  shortDesc?: string;
  price?: { amount?: number; currency?: string };
  imageUrl: string | null;
}

type ProductRow = {
  _id: string;
  name: string;
  slug: string;
  shortDesc?: string;
  price?: { amount?: number; currency?: string };
  image?: SanityImageSource;
};

export async function listProducts(limit = 50): Promise<ProductListItem[]> {
  if (!hasSanityEnv) return [];
  const q = `*[_type=="product"] | order(_createdAt desc)[0...$limit]{
    _id, name, "slug": slug.current, shortDesc, price{amount,currency}, image
  }`;
  const rows = await client.fetch<ProductRow[]>(q, { limit });
  return rows.map((p) => ({
    _id: p._id,
    name: p.name,
    slug: p.slug,
    shortDesc: p.shortDesc,
    price: p.price,
    imageUrl: p.image ? imageUrl(p.image, 800, 800) : null,
  }));
}