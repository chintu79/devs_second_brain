import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaNeon } from "@prisma/adapter-neon";

const dbUrl = process.env.DATABASE_URL!;
const isLocal = dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1");

const prismaClientSingleton = () => {
  if (isLocal) {
    const pool = new pg.Pool({ connectionString: dbUrl });
    return new PrismaClient({ adapter: new PrismaPg(pool) });
  }
  // Neon behind Cloudflare — use WebSockets instead of raw TCP
  return new PrismaClient({ adapter: new PrismaNeon({ connectionString: dbUrl }) });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
