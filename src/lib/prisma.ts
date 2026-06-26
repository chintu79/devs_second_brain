import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const dbUrl = new URL(process.env.DATABASE_URL!);
const poolConfig: pg.PoolConfig = {
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1),
  port: parseInt(dbUrl.port || "5432"),
};

if (dbUrl.hostname === "localhost" || dbUrl.hostname === "127.0.0.1") {
  poolConfig.host = "/var/run/postgresql";
} else {
  poolConfig.host = dbUrl.hostname;
}

const pool = new pg.Pool(poolConfig);

const adapter = new PrismaPg(pool);

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

export async function safeQuery<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      console.error(`[DB] ${label}:`, JSON.stringify({ code: (error as Record<string, unknown>).code, message: error instanceof Error ? error.message : String(error), meta: (error as Record<string, unknown>).meta, clientVersion: (error as Record<string, unknown>).clientVersion }, null, 2));
    } else {
      console.error(`[DB] ${label}:`, error instanceof Error ? error.message : String(error));
    }
    console.error(`[DB] ${label} stack:`, error instanceof Error ? error.stack : new Error().stack);
    return fallback;
  }
}
