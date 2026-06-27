// 1. Import the native PostgreSQL connection engine
import pg from "pg";
// 2. Import Prisma's Driver Adapter built for PostgreSQL databases
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * 3. Import PrismaClient directly from the exact generated file path!
 * Because we target src/generated, and this file lives in src/config,
 * we move out one level (../) and enter 'generated/index.js'.
 */
import { PrismaClient } from "../generated/index.js";

// Establish a standard connection pool using native 'pg'
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Pass the connection pool straight into Prisma's Driver Adapter layer
const adapter = new PrismaPg(pool);

// Initialize PrismaClient by explicitly giving it our database driver adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
