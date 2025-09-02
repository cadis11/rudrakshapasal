import "server-only";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export const sanity = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  useCdn: true,
});

// Server-side writer (requires SANITY_WRITE_TOKEN in env)
export const sanityWrite = createClient({
  projectId,
  dataset,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2025-01-01",
  useCdn: false,
});