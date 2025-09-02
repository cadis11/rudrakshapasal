const path = require("path");
require("dotenv").config({
  path: path.resolve(process.cwd(), ".env.local"),
  override: true,                      // <= force .env.local to win
});
const { createClient } = require("@sanity/client");

const {
  SANITY_PROJECT_ID,
  SANITY_DATASET,
  SANITY_API_VERSION = "2023-10-01",
  SANITY_API_TOKEN,
} = process.env;

if (!SANITY_PROJECT_ID || !SANITY_DATASET || !SANITY_API_TOKEN) {
  console.error("Missing env: SANITY_PROJECT_ID, SANITY_DATASET, or SANITY_API_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  token: SANITY_API_TOKEN,
  useCdn: false,
});

const products = [
  {
    _type: "product",
    title: "7 Mukhi Rudraksha (Premium Nepal)",
    slug: { _type: "slug", current: "7-mukhi-rudraksha-premium-nepal" },
    mukhi: 7, size_mm: 18, origin: "Nepal", priceNpr: 9500, sku: "RP-7M-NEP-18",
    stock: 5, status: "active",
    description: "Authentic 7 Mukhi Rudraksha from Nepal. Includes X-ray report + activation video.",
  },
  {
    _type: "product",
    title: "5 Mukhi Rudraksha (Everyday Wear)",
    slug: { _type: "slug", current: "5-mukhi-rudraksha-everyday" },
    mukhi: 5, size_mm: 16, origin: "Indonesia", priceNpr: 2200, sku: "RP-5M-IDN-16",
    stock: 20, status: "active",
    description: "Classic 5 Mukhi for daily wear. X-ray report available; activation video after order.",
  },
  {
    _type: "product",
    title: "9 Mukhi Rudraksha (Select Nepal)",
    slug: { _type: "slug", current: "9-mukhi-rudraksha-select-nepal" },
    mukhi: 9, size_mm: 19, origin: "Nepal", priceNpr: 18500, sku: "RP-9M-NEP-19",
    stock: 3, status: "active",
    description: "Select 9 Mukhi Rudraksha from Nepal. Report + activation workflow included.",
  },
];

(async () => {
  const count = await client.fetch('count(*[_type == "product"])');
  if (count > 0) return console.log(`Products already exist (${count}). No seeding performed.`);
  let tx = client.transaction();
  for (const p of products) tx = tx.create(p);
  await tx.commit();
  console.log(`Seeded ${products.length} products into "${SANITY_DATASET}".`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});