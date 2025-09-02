export type SanityClient = {
  fetch: <T = unknown>(groq: string, params?: Record<string, unknown>) => Promise<T>;
};

function qsParams(params?: Record<string, unknown>) {
  if (!params) return "";
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    sp.set(`$${k}`, String(v ?? ""));
  }
  const s = sp.toString();
  return s ? `&${s}` : "";
}

function envSanity() {
  const pid = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
  const ds  = process.env.SANITY_DATASET     || process.env.NEXT_PUBLIC_SANITY_DATASET     || "production";
  const ver = process.env.SANITY_API_VERSION || process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-10-01";
  const tok = process.env.SANITY_API_TOKEN;
  if (!pid) throw new Error("Missing SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_PROJECT_ID");
  return { pid, ds, ver, tok };
}

export function getSanityClient(): SanityClient {
  const { pid, ds, ver, tok } = envSanity();
  return {
    async fetch<T = unknown>(groq: string, params?: Record<string, unknown>): Promise<T> {
      const query = encodeURIComponent(groq);
      const url   = `https://${pid}.api.sanity.io/v${ver}/data/query/${ds}?query=${query}${qsParams(params)}`;
      const headers: Record<string, string> = tok ? { Authorization: `Bearer ${tok}` } : {};
      const res = await fetch(url, { headers, cache: "no-store" });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Sanity fetch failed ${res.status}: ${txt}`);
      }
      const json = await res.json();
      return (json && json.result) as T;
    },
  };
}

export async function sanityFetch<T = unknown>(groq: string, params?: Record<string, unknown>) {
  return getSanityClient().fetch<T>(groq, params);
}

export const sanityQuery = sanityFetch;

export async function sanityMutate(mutations: unknown | unknown[]) {
  const { pid, ds, ver, tok } = envSanity();
  if (!tok) throw new Error("SANITY_API_TOKEN is required for mutations");
  const url = `https://${pid}.api.sanity.io/v${ver}/data/mutate/${ds}`;
  const body = JSON.stringify({ mutations: Array.isArray(mutations) ? mutations : [mutations] });
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` },
    body,
    cache: "no-store",
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Sanity mutate failed ${res.status}: ${txt}`);
  }
  return res.json();
}