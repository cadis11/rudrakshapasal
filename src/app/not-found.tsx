import Link from "next/link";

export default function NotFound(){
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-bold mb-3">Page not found</h1>
      <p className="text-neutral-300 mb-6">The page you requested does not exist.</p>
      <Link href="/en" className="underline">Back to products</Link>
    </main>
  );
}