import Link from "next/link";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="mx-auto max-w-lg px-6 py-16 text-center">
      <h1 className="text-2xl font-bold mb-3">Thank you for your purchase! 🙏</h1>
      <p className="text-neutral-300">We received your order and will update you soon.</p>
      <p className="text-neutral-500 mt-2 text-sm">Reference: <span className="font-mono">{id}</span></p>
      <div className="mt-8">
        <Link href="/en" className="rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-5 py-2.5 font-medium">Continue shopping</Link>
      </div>
    </main>
  );
}