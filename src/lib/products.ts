import groq from "groq";
import { getSanityClient } from "@/lib/sanity";
import { products as fallback } from "@/data/products";

export type ProductView = {
  slug: string;
  name: string;
  mukhi: number;
  priceNPR: number;
  sizeMM: number;
  origin?: string;
  image: string | null;
  pdfUrl?: string | null;
  videoUrl?: string | null;
};

function num(v: unknown, d = 0): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const n = Number(String(v ?? "").trim());
  return Number.isFinite(n) ? n : d;
}
function uniqBySlug(rows: any[]): any[] {
  const seen = new Set<string>();
  const out: any[] = [];
  for (const r of rows) {
    const s = r?.slug;
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(r);
  }
  return out;
}

const FIELDS = `
  "slug": slug.current,
  name,
  mukhi,
  priceNPR,
  sizeMM,
  origin,
  "image": coalesce(image.asset->url, mainImage.asset->url, imageUrl),
  pdfUrl,
  videoUrl
`;
const Q_ALL = groq`*[_type == "product"] | order(_updatedAt desc){ ${FIELDS} }`;
const Q_ONE = groq`*[_type == "product" && slug.current == $slug][0]{ ${FIELDS} }`;

export async function getProducts(): Promise<ProductView[]> {
  const client = getSanityClient();
  if (!client) {
    return fallback.map(p => ({
      slug: p.slug, name: p.name, mukhi: num(p.mukhi), priceNPR: num(p.priceNPR),
      sizeMM: num(p.sizeMM), origin: p.origin, image: p.image, pdfUrl: null, videoUrl: null
    }));
  }
  try {
    const rows = uniqBySlug(await client.fetch<any[]>(Q_ALL));
    return rows.map(r => ({
      slug: r.slug,
      name: r.name ?? "Unnamed product",
      mukhi: num(r.mukhi),
      priceNPR: num(r.priceNPR),
      sizeMM: num(r.sizeMM),
      origin: r.origin ?? undefined,
      image: r.image ?? "/placeholder.svg",
      pdfUrl: r.pdfUrl ?? null,
      videoUrl: r.videoUrl ?? null,
    }));
  } catch {
    return fallback.map(p => ({
      slug: p.slug, name: p.name, mukhi: num(p.mukhi), priceNPR: num(p.priceNPR),
      sizeMM: num(p.sizeMM), origin: p.origin, image: p.image, pdfUrl: null, videoUrl: null
    }));
  }
}

export async function getProductBySlug(slug: string): Promise<ProductView | null> {
  const client = getSanityClient();
  if (!client) {
    const p = fallback.find(x => x.slug === slug);
    return p ? {
      slug: p.slug, name: p.name, mukhi: num(p.mukhi), priceNPR: num(p.priceNPR),
      sizeMM: num(p.sizeMM), origin: p.origin, image: p.image, pdfUrl: null, videoUrl: null
    } : null;
  }
  try {
    const r = await client.fetch<any>(Q_ONE, { slug });
    if (!r) return null;
    return {
      slug: r.slug,
      name: r.name ?? "Unnamed product",
      mukhi: num(r.mukhi),
      priceNPR: num(r.priceNPR),
      sizeMM: num(r.sizeMM),
      origin: r.origin ?? undefined,
      image: r.image ?? "/placeholder.svg",
      pdfUrl: r.pdfUrl ?? null,
      videoUrl: r.videoUrl ?? null,
    };
  } catch {
    const p = fallback.find(x => x.slug === slug);
    return p ? {
      slug: p.slug, name: p.name, mukhi: num(p.mukhi), priceNPR: num(p.priceNPR),
      sizeMM: num(p.sizeMM), origin: p.origin, image: p.image, pdfUrl: null, videoUrl: null
    } : null;
  }
}