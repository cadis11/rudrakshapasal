/**
 * Prisma removed. This placeholder prevents build-time imports from failing.
 * If you need DB in future, wire Sanity or another service here.
 */
export type EmptyDB = Record<string, never>;
export const db: EmptyDB = Object.freeze({});

export function notUsed() {
  return null as unknown as never;
}