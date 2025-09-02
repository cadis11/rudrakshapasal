import imageUrlBuilder from "@sanity/image-url";
import { projectId, dataset } from "@/server/sanity/env";

// Keep the source type flexible, but *not* any
export type SanityImageSource = unknown;

const builder = imageUrlBuilder({ projectId, dataset });

export function imageUrl(
  src: SanityImageSource,
  width = 1000,
  height = 1000
): string | null {
  try {
    // builder.image accepts many shapes; cast locally
    const u = builder.image(src as unknown as Parameters<typeof builder.image>[0])
      .width(width)
      .height(height)
      .url();
    return u || null;
  } catch {
    return null;
  }
}