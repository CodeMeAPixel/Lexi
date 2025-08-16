import { PrismaClient } from "@prisma/client";

declare global {
    // allow global prisma during development to avoid exhausting connections
    // eslint-disable-next-line no-var
    var __prisma?: PrismaClient;
}

export const prisma: PrismaClient = global.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") global.__prisma = prisma;
