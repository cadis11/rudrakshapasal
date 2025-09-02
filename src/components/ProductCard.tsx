import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

export type CardProduct = {
  _id: string;
  name: string;
  slug?: { current: string };
  priceNPR?: number;
  grade?: string;
  sizeMM?: number;
  mukhi?: number;
  origin?: string;
  imageUrl?: string | null;
};

function currencyNPR(n?: number) {
  if (typeof n !== "number") return "";
  return new Intl.NumberFormat("en-NP", { style: "currency", currency: "NPR", maximumFractionDigits: 0 }).format(n);
}

export default function ProductCard({ p }: { p: CardProduct }) {
  const price = currencyNPR(p.priceNPR);
  const href  = p.slug?.current ? `/en/product/${p.slug.current}` : "#";

  return (
    <div className="group relative rounded-2xl border border-white/10 bg-black/20 overflow-hidden flex flex-col transition hover:border-white/20 hover:shadow-xl hover:shadow-black/40">
      <Link href={href} className="absolute inset-0 z-10" aria-label={p.name}></Link>

      <div className="relative w-full h-64 bg-neutral-900 grid place-items-center">
        {p.imageUrl ? (
          <img src={p.imageUrl} alt={p.name} className="max-h-64 w-auto object-contain" />
        ) : (
          <div className="w-full h-full grid place-items-center text-sm text-neutral-400">No image</div>
        )}
        {p.grade && (
          <div className="absolute left-2 top-2 z-20 rounded-full border border-amber-400/30 bg-amber-500/20 px-2 py-0.5 text-xs text-amber-200">
            {p.grade}
          </div>
        )}
      </div>

      <div className="p-4 grow">
        <h3 className="font-semibold leading-snug group-hover:underline">{p.name}</h3>
        <div className="mt-1 text-sm text-neutral-300">
          {p.mukhi ? <span>Mukhi: {p.mukhi}</span> : null}
          {p.sizeMM ? <span>{p.mukhi ? " • " : ""}Size: {p.sizeMM}mm</span> : null}
          {p.origin ? <span>{(p.mukhi || p.sizeMM) ? " • " : ""}{p.origin}</span> : null}
        </div>
        {price && <div className="mt-2 font-semibold">{price}</div>}
      </div>

      <div className="p-4 pt-0 flex gap-2">
        <Link href={href} className="relative z-20 rounded-xl border border-white/20 px-3 py-1.5 text-sm">View</Link>
        <AddToCartButton id={p._id} slug={p.slug?.current} name={p.name} priceNPR={p.priceNPR} imageUrl={p.imageUrl} />
      </div>
    </div>
  );
}