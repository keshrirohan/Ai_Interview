/**
 * list-users.mjs — lists all users in the database
 */
import "dotenv/config";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const res = await pool.query('SELECT id, name, email, role FROM "User" ORDER BY "createdAt" DESC LIMIT 20');
  console.log("\n📋 Current users in DB:\n");
  console.table(res.rows);
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
