// @ts-nocheck
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.customer.upsert({
    where: { email: "demo@rp.com" },
    update: {},
    create: { email: "demo@rp.com", name: "Demo User" },
  });
  console.log("âœ… Seed complete");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });