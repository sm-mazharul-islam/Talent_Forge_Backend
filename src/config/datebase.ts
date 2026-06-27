// 1. Ensure environment variables are loaded from your .env file immediately
import "dotenv/config";

// 2. Import the native PostgreSQL connection engine
import pg from "pg";
// 3. Import Prisma's Driver Adapter built for PostgreSQL databases
import { PrismaPg } from "@prisma/adapter-pg";
// 4. Import PrismaClient from your custom generated output path (No extension for bundler resolution)
import { PrismaClient } from "../generated";

// Establish a standard connection pool using native 'pg'
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Pass the connection pool straight into Prisma's Driver Adapter layer
const adapter = new PrismaPg(pool);

// Initialize PrismaClient by explicitly giving it our database driver adapter and casting it cleanly
const prisma = new PrismaClient({ adapter }) as any;

// Automated Connection Test Function
async function testConnection() {
  try {
    // Send a low-overhead query directly down the connection pooler pipe
    await prisma.$queryRaw`SELECT 1`;
    console.log(
      "🚀 [Database]: Successfully authenticated and connected to Supabase!",
    );
  } catch (error) {
    console.error(
      "❌ [Database]: Connection failed! Check your password or network connection.",
    );
    console.error(error);
  }
}

// Run the check on startup
testConnection();

export default prisma;
