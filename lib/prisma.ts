import { PrismaClient } from "@prisma/client";

const prismaClientSignleton = () => {
  try {
    return new PrismaClient();
  } catch (error) {
    console.error("Failed to initialize PrismaClient:", error);
    throw error;
  }
};

type prismaClientSignleton = ReturnType<typeof prismaClientSignleton>;

const globalforPrisma = global as unknown as {
  prisma: prismaClientSignleton | undefined;
};

const prisma = globalforPrisma.prisma ?? prismaClientSignleton();

if (process.env.NODE_ENV !== "production") {
  globalforPrisma.prisma = prisma;
}

export default prisma;
