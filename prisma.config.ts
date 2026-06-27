import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Prisma 7 handles the database URL completely right here!
    url: process.env.DATABASE_URL, // 👈 Prisma v7 picks up your connection here
  },
});
