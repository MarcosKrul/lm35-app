import { prismaClient } from "@infra/database/client";
import { PrismaPromise } from "@prisma/client";
import { ILM35DataRepository } from "@repositories/LM35Data/models/ILM35DataRepository";

class LM35DataRepository implements ILM35DataRepository {
  constructor(private prisma = prismaClient) {}

  save(): PrismaPromise<any> {
    throw new Error("Method not implemented.");
  }
}

export { LM35DataRepository };
