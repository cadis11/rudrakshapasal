import { createClient } from "@sanity/client";
import { projectId, dataset, hasSanityEnv } from "./env";

type FetchFn = <T = unknown>(q: string, params?: Record<string, unknown>) => Promise<T>;
type SanityLike = { fetch: FetchFn };

const real = hasSanityEnv
  ? createClient({ projectId, dataset, apiVersion: "2025-01-01", useCdn: true })
  : null;

// If no env, return [] for any fetch so pages can render with empty data.
export const client: SanityLike = real ?? { fetch: (async () => [] ) as FetchFn };