import { client } from "./client";
import { imageUrl, type SanityImageSource } from "@/lib/sanity/image";

export interface ProductDetail {
  _id: string;
  name: string;
  slug: string;
  shortDesc?: string;
  mukhi?: number;
  features?: string[];
  price?: { amount?: number; currency?: string };
  imageUrl: string | null;
  xrayUrl: string | null;
  activationVideoUrl?: string | null;
}

type ProductRow = {
  _id: string;
  name: string;
  slug: { current: string };
  shortDesc?: string;
  mukhi?: number;
  features?: string[];
  price?: { amount?: number; currency?: string };
  image?: SanityImageSource;
  xrayPdf?: { asset?: { url?: string } };
  activationVideoUrl?: string | null;
};

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const q = `*[_type=="product" && slug.current==$slug][0]{
    _id, name, "slug": slug.current, shortDesc, mukhi, features,
    price{amount, currency}, image, xrayPdf{asset->{"url": url}}, activationVideoUrl
  }`;
  const p = await client.fetch<ProductRow | null>(q, { slug });
  if (!p) return null;
  return {
    _id: p._id,
    name: p.name,
    slug: typeof p.slug === "string" ? p.slug : p.slug?.current ?? "",
    shortDesc: p.shortDesc,
    mukhi: p.mukhi,
    features: p.features,
    price: p.price,
    imageUrl: p.image ? imageUrl(p.image, 1000, 1000) : null,
    xrayUrl: p.xrayPdf?.asset?.url ?? null,
    activationVideoUrl: p.activationVideoUrl ?? null,
  };
}

export async function getProductById(_id: string) {
  const q = `*[_type=="product" && _id==$id][0]{
    _id, name, shortDesc, price{amount,currency}, activationVideoUrl
  }`;
  return client.fetch(q, { id: _id }) as Promise<{
    _id: string;
    name: string;
    shortDesc?: string;
    price?: { amount?: number; currency?: string };
    activationVideoUrl?: string | null;
  } | null>;
}