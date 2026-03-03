import { PrismaClient } from "@prisma/client";

// NOTE: This file is deprecated. Use lib/prisma-optimized.ts for better performance
// The optimized version includes connection pooling and better configuration for cross-region requests

const prismaClientSingleton = () => {
  try {
    return new PrismaClient();
  } catch (error) {
    console.error("Failed to initialize PrismaClient:", error);
    throw error;
  }
};

type prismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalforPrisma = global as unknown as {
  prisma: prismaClientSingleton | undefined;
};

const prisma = globalforPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalforPrisma.prisma = prisma;
}

export default prisma;
