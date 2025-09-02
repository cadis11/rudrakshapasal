import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

type Product = {
  _id: string;
  name: string;
  slug?: { current: string };
  mukhi?: number;
  sizeMM?: number;
  grade?: string;
  origin?: string;
  priceNPR?: number;
  description?: string;
  imageUrl?: string | null;
};

function currencyNPR(n?: number) {
  if (typeof n !== "number") return "";
  return new Intl.NumberFormat("en-NP", { style: "currency", currency: "NPR", maximumFractionDigits: 0 }).format(n);
}
function escSlug(s: string) { return s.replace(/[^a-z0-9\-]/gi, ""); }

async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const pid   = process.env.SANITY_PROJECT_ID!;
  const ds    = process.env.SANITY_DATASET || "production";
  const ver   = process.env.SANITY_API_VERSION || "2023-10-01";
  const token = process.env.SANITY_API_TOKEN;
  const safe = escSlug(slug);
  const groq = "*[_type=='product' && slug.current=='" + safe + "'][0]{ _id,name,slug,mukhi,sizeMM,grade,origin,priceNPR,description, 'imageUrl': image.asset->url }";
  const q    = encodeURIComponent(groq);
  const url  = "https://" + pid + ".api.sanity.io/v" + ver + "/data/query/" + ds + "?query=" + q;
  const headers: HeadersInit = {};
  if (token) (headers as any).Authorization = "Bearer " + token;
  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  return (data && data.result) || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await fetchProductBySlug(slug);
  const title = p?.name ? `${p.name} — Rudraksha-Pasal` : "Product — Rudraksha-Pasal";
  const desc  = p?.description || "Authentic rudraksha bead.";
  const site  = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url   = `${site}/en/product/${slug}`;
  const img   = p?.imageUrl;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "website", // Next 15 valid type
      title,
      description: desc,
      url,
      images: img ? [{ url: img }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: img ? [img] : [],
    },
    // Inject raw og:type=product without tripping Next's validator
    other: { "og:type": "product" },
  };
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const product = await fetchProductBySlug(slug);
  if (!product) return notFound();

  const { _id, name, imageUrl, grade, mukhi, sizeMM, origin, priceNPR, description, slug: s } = product;

  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: description || "",
    image: imageUrl ? [imageUrl] : [],
    brand: "Rudraksha-Pasal",
    sku: _id,
    offers: typeof priceNPR === "number" ? {
      "@type": "Offer",
      price: String(priceNPR),
      priceCurrency: "NPR",
      availability: "https://schema.org/InStock",
      url: `/en/product/${s?.current ?? ""}`
    } : undefined
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="mb-6 text-sm text-neutral-400">
        <Link href="/en" className="hover:underline">Rudraksha Beads</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-300">{name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-8 md:gap-10">
        <div className="md:max-w-md w-full">
          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-3 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
            <div className="w-full h-72 md:h-80 rounded-lg overflow-hidden bg-neutral-900 grid place-items-center">
              {imageUrl ? (
                <img src={imageUrl} alt={name} className="max-h-80 w-auto object-contain" />
              ) : (
                <div className="w-full h-full grid place-items-center text-sm text-neutral-400">No image</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{name}</h1>
          {typeof priceNPR === "number" && (
            <div className="text-xl md:text-2xl font-semibold text-amber-400">{currencyNPR(priceNPR)}</div>
          )}

          <div className="grid grid-cols-2 gap-y-2 text-sm text-neutral-300">
            {mukhi ?  <div><span className="opacity-70">Mukhi:</span> {mukhi}</div>   : null}
            {sizeMM ? <div><span className="opacity-70">Size:</span> {sizeMM}mm</div> : null}
            {grade ?  <div><span className="opacity-70">Grade:</span> {grade}</div>   : null}
            {origin ? <div><span className="opacity-70">Origin:</span> {origin}</div> : null}
          </div>

          {description && (<p className="leading-relaxed text-neutral-200">{description}</p>)}

          <div className="flex flex-wrap gap-3 pt-1">
            <AddToCartButton id={_id} slug={s?.current} name={name} priceNPR={priceNPR} imageUrl={imageUrl} size="lg" />
            <a href="/en/cart" className="rounded-xl px-5 py-2.5 bg-neutral-900 border border-white/15 text-neutral-300">
              Buy now (go to cart)
            </a>
          </div>

          <div className="flex flex-wrap gap-3 pt-2 text-xs text-neutral-400">
            <div className="rounded-md border border-white/10 bg-black/20 px-3 py-1.5">✅ X-ray verified authenticity</div>
            <div className="rounded-md border border-white/10 bg-black/20 px-3 py-1.5">🎥 Activation (puja) video included</div>
            <div className="rounded-md border border-white/10 bg-black/20 px-3 py-1.5">🔒 Secure checkout</div>
          </div>

          <div className="pt-1">
            <Link href="/en" className="text-sm underline opacity-80 hover:opacity-100">Back to products</Link>
          </div>
        </div>
      </div>
    </div>
  );
}