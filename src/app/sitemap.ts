import type { MetadataRoute } from "next";

async function fetchSlugs(): Promise<string[]> {
  const pid   = process.env.SANITY_PROJECT_ID!;
  const ds    = process.env.SANITY_DATASET || "production";
  const ver   = process.env.SANITY_API_VERSION || "2023-10-01";
  const groq  = "*[_type=='product']{ 'slug': slug.current }";
  const q     = encodeURIComponent(groq);
  const url   = `https://${pid}.api.sanity.io/v${ver}/data/query/${ds}?query=${q}`;
  const res   = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  const data  = await res.json();
  const rows  = (data && data.result) || [];
  return rows.map((r: any) => r.slug).filter(Boolean);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const slugs = await fetchSlugs();
  const pages: MetadataRoute.Sitemap = [
    { url: `${site}/en`, lastModified: new Date(), priority: 0.9 },
  ];
  slugs.forEach(s => pages.push({ url: `${site}/en/product/${s}`, lastModified: new Date(), priority: 0.8 }));
  return pages;
}