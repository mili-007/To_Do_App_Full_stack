const { PrismaClient } = require('@prisma/client');

/**
 * Prisma client singleton.
 * Keeps behavior predictable across dev reloads and avoids excessive connections.
 */
let prisma;

const getPrisma = () => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};

const connectPrisma = async () => {
  const client = getPrisma();
  await client.$connect();
  return client;
};

module.exports = {
  getPrisma,
  connectPrisma,
};

