export async function sanityQuery<T=any>(groq: string): Promise<T> {
  const pid = process.env.SANITY_PROJECT_ID!;
  const ds  = process.env.SANITY_DATASET || "production";
  const ver = process.env.SANITY_API_VERSION || "2023-10-01";
  const url = `https://${pid}.api.sanity.io/v${ver}/data/query/${ds}?query=${encodeURIComponent(groq)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Sanity query failed");
  const data = await res.json();
  return (data && data.result) as T;
}
export async function sanityMutate(body: any) {
  const pid = process.env.SANITY_PROJECT_ID!;
  const ds  = process.env.SANITY_DATASET || "production";
  const ver = process.env.SANITY_API_VERSION || "2023-10-01";
  const token = process.env.SANITY_API_TOKEN;
  if (!token) throw new Error("Missing SANITY_API_TOKEN");
  const url = `https://${pid}.api.sanity.io/v${ver}/data/mutate/${ds}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text().catch(()=> "Sanity mutate failed"));
  return res.json();
}