import {defineType, defineField} from "sanity"

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: r => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name", maxLength: 96 }, validation: r => r.required() }),
    defineField({ name: "mukhi", title: "Mukhi", type: "number" }),
    defineField({ name: "priceNPR", title: "Price (NPR)", type: "number" }),
    defineField({ name: "sizeMM", title: "Size (mm)", type: "number" }),
    defineField({ name: "origin", title: "Origin", type: "string" }),
    defineField({ name: "image", title: "Main Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageUrl", title: "Image URL (optional)", type: "url", description: "If not uploading to Sanity, paste a direct image URL" }),
    defineField({ name: "pdfUrl", title: "X-ray PDF URL", type: "url" }),
    defineField({ name: "videoUrl", title: "Activation Video URL", type: "url" }),
    defineField({ name: "shortSpec", title: "Highlights", type: "array", of: [{ type:"string" }] }),
  ],
  preview: {
    select: { title: "name", media: "image", mukhi: "mukhi", sizeMM: "sizeMM", price: "priceNPR" },
    prepare(sel) {
      const { title, media, mukhi, sizeMM, price } = sel as any
      const parts: string[] = []
      if (typeof mukhi === "number") parts.push(`Mukhi ${mukhi}`)
      if (typeof sizeMM === "number") parts.push(`${sizeMM}mm`)
      if (typeof price === "number") parts.push(`NPR ${price.toLocaleString("en-NP")}`)
      return { title: title || "Unnamed product", subtitle: parts.join(" • "), media }
    }
  }
})