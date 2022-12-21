import { LM35DataModel } from "@models/domain/LM35DataModel";
import { PrismaPromise } from "@prisma/client";

interface ILM35DataRepository {
  save(
    data: Exclude<LM35DataModel, "id">
  ): PrismaPromise<Partial<LM35DataModel>>;
}

export { ILM35DataRepository };
