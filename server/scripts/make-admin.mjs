/**
 * make-admin.mjs
 *
 * One-time script to promote a user account to ADMIN role.
 *
 * Usage:
 *   node server/scripts/make-admin.mjs your@email.com
 *
 * Run from the project root (e:\EchoHire_AI):
 *   cd server
 *   node scripts/make-admin.mjs your@email.com
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/index.js";
import pg from "pg";

const { Pool } = pg;

const email = process.argv[2];
if (!email) {
  console.error("❌  Usage: node scripts/make-admin.mjs <email>");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });

  if (!user) {
    console.error(`❌  No user found with email: ${email}`);
    await prisma.$disconnect();
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { email: email.trim().toLowerCase() },
    data: { role: "ADMIN" },
    select: { id: true, name: true, email: true, role: true },
  });

  console.log("✅  User promoted to ADMIN:");
  console.table([updated]);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
