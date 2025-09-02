"use client";
export function track(event: string, payload?: Record<string, unknown>) {
  // TODO: wire GA4 gtag here
  console.log("[GA]", event, payload ?? {});
}