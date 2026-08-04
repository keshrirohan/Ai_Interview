/**
 * prisma.js
 *
 * Creates and exports a single PrismaClient instance shared across the app.
 *
 * Why a singleton?
 *   Prisma opens a connection pool. Instantiating it more than once in the
 *   same process wastes connections and can cause "too many clients" errors
 *   in PostgreSQL. One instance is created here and imported everywhere else.
 *
 * Why PrismaPg adapter?
 *   The @prisma/adapter-pg adapter uses the native pg driver instead of
 *   Prisma's built-in engine, which enables edge runtime compatibility and
 *   gives us direct control over the connection string.
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
