// One shared Prisma client for the whole app.
// Prisma 7 talks to PostgreSQL through a "driver adapter" (node-postgres).
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";
import { env } from "../config/env.js";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });
