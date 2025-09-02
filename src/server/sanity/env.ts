export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET || "";
export const hasSanityEnv = Boolean(projectId && dataset);