import { PrismaClient } from "@prisma/client";

import {
  handleErrorLog,
  handleQueryLog,
} from "../handlers/databaseLogHandling";

const prismaClient = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "error" },
  ],
});

prismaClient.$on("query", handleQueryLog);
prismaClient.$on("error", handleErrorLog);

export { prismaClient };
