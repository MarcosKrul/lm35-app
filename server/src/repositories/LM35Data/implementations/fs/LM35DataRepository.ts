import fs from "fs";
import path from "path";

import { prismaClient } from "@infra/database/client";
import { LM35DataModel } from "@models/domain/LM35DataModel";
import { PrismaPromise } from "@prisma/client";
import { ILM35DataRepository } from "@repositories/LM35Data/models/ILM35DataRepository";

class LM35DataRepository implements ILM35DataRepository {
  constructor(private prisma = prismaClient) {}

  save({
    analog,
    temp,
    timestamp,
    milliVolts,
  }: Exclude<LM35DataModel, "id">): PrismaPromise<Partial<LM35DataModel>> {
    const [date, time] = timestamp.toISOString().split("T");

    fs.appendFileSync(
      path.resolve(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "..",
        "static",
        "lm35data",
        `${timestamp
          .toISOString()
          .split("T")[0]
          .split("-")
          .reverse()
          .join("_")}.csv`
      ),
      `${date.split("-").reverse().join("/")};${
        time.split(".")[0]
      };${temp};${analog};${milliVolts}\n`
    );

    return this.prisma.lM35Data.create({
      data: {
        analog,
        temp,
        timestamp,
        milliVolts,
      },
    });
  }
}

export { LM35DataRepository };
