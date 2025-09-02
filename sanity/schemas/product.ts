import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: r=>r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: r=>r.required() }),
    defineField({ name: "shortDesc", type: "text" }),
    defineField({ name: "mukhi", type: "number" }),
    defineField({ name: "image", type: "image", options:{ hotspot:true } }),
    defineField({ name: "xrayPdf", type: "file" }),
    defineField({ name: "activationVideoUrl", type: "url" }),
    defineField({
      name: "price",
      type: "object",
      fields: [
        defineField({ name: "amount", type: "number" }),
        defineField({ name: "currency", type: "string", options: { list: ["NPR","USD","INR"] } }),
      ]
    }),
    defineField({ name: "features", type: "array", of: [{ type: "string" }] }),
  ]
});