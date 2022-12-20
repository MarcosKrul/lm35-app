import { LM35Data, PrismaPromise } from "@prisma/client";

interface ILM35DataRepository {
  save(data: Exclude<LM35Data, "id">): PrismaPromise<LM35Data>;
}

export { ILM35DataRepository };
