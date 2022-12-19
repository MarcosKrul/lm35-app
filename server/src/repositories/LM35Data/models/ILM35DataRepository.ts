import { PrismaPromise } from "@prisma/client";

interface ILM35DataRepository {
  save(): PrismaPromise<any>;
}

export { ILM35DataRepository };
