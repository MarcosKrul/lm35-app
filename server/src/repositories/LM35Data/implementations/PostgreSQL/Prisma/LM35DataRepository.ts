import { prismaClient } from "@infra/database/client";
import { LM35Data, PrismaPromise } from "@prisma/client";
import { ILM35DataRepository } from "@repositories/LM35Data/models/ILM35DataRepository";

class LM35DataRepository implements ILM35DataRepository {
  constructor(private prisma = prismaClient) {}

  save = ({
    analog,
    temp,
    timestamp,
  }: Exclude<LM35Data, "id">): PrismaPromise<LM35Data> =>
    this.prisma.lM35Data.create({
      data: {
        analog,
        temp,
        timestamp,
      },
    });
}

export { LM35DataRepository };
