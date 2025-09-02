import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token     = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing env vars: projectId/dataset/token");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2025-01-01", useCdn: false });

async function uploadAsset(type, url, filename) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch " + url + " status " + res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") || undefined;
  return client.assets.upload(type, buf, { filename, contentType });
}

async function seed() {
  const items = [
    {
      _id: "seed-5-mukhi",
      title: "5-Mukhi Rudraksha",
      slug: { current: "5-mukhi" },
      price: 1200,
      mukhi: "5",
      description: "Natural 5-Mukhi Rudraksha bead, ideal for daily wear.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Rudraksha.jpg",
      xrayUrl:  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      _id: "seed-7-mukhi",
      title: "7-Mukhi Rudraksha",
      slug: { current: "7-mukhi" },
      price: 2800,
      mukhi: "7",
      description: "Authentic 7-Mukhi Rudraksha, X-ray verified, from Nepal.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/RudrakshaBeads.jpg",
      xrayUrl:  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      _id: "seed-9-mukhi",
      title: "9-Mukhi Rudraksha",
      slug: { current: "9-mukhi" },
      price: 6500,
      mukhi: "9",
      description: "Premium 9-Mukhi Rudraksha for spiritual growth and energy.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Rudraksha_beads.jpg",
      xrayUrl:  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
  ];

  for (const p of items) {
    console.log("\\n=== Seeding:", p.title, "===");
    let imageRef, fileRef;

    if (p.imageUrl) {
      const img = await uploadAsset("image", p.imageUrl, p.slug.current + ".jpg");
      imageRef = { _type: "image", asset: { _type: "reference", _ref: img._id } };
      console.log("  • Image uploaded:", img.url);
    }
    if (p.xrayUrl) {
      const pdf = await uploadAsset("file", p.xrayUrl, p.slug.current + "-xray.pdf");
      fileRef = { _type: "file", asset: { _type: "reference", _ref: pdf._id } };
      console.log("  • PDF uploaded:", pdf.url);
    }

    const doc = {
      _id: p._id,
      _type: "product",
      title: p.title,
      slug: p.slug,
      price: p.price,
      mukhi: p.mukhi,
      description: p.description,
      image: imageRef,
      xray: fileRef,
    };
    const created = await client.createIfNotExists(doc);
    console.log("  • Created:", created._id);
  }
}

seed()
  .then(() => { console.log("\\n✔ Done seeding!"); process.exit(0); })
  .catch(err => { console.error("❌ Seed failed:", err); process.exit(1); });