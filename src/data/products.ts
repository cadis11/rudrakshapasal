export type Product = {
  slug: string;
  name: string;
  mukhi: number;
  priceNPR: number;
  sizeMM: number;
  origin?: string;
  image: string;
  shortSpec: string[];
};
export const products: Product[] = [
  {
    slug: "rudraksha-7-mukhi-premium",
    name: "7 Mukhi Rudraksha — Premium",
    mukhi: 7,
    priceNPR: 8999,
    sizeMM: 18,
    origin: "Nepal",
    image: "/placeholder.svg",
    shortSpec: ["Certificate: X-ray included","Activation Puja video","Handpicked • Natural"],
  },
  {
    slug: "rudraksha-5-mukhi-classic",
    name: "5 Mukhi Rudraksha — Classic",
    mukhi: 5,
    priceNPR: 1499,
    sizeMM: 16,
    origin: "Nepal",
    image: "/placeholder.svg",
    shortSpec: ["Everyday wear","X-ray authenticity","Great value"],
  }
];