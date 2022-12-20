import "reflect-metadata";
import "express-async-errors";
import "@containers/index";

import { container } from "tsyringe";

import { TopicsMQTT } from "@common/TopicsMQTT";
import { AppError } from "@handlers/errors/AppError";
import { env } from "@helpers/env";
import { app } from "@infra/http/app";
import { logger } from "@infra/log";
import { mqttClient } from "@infra/mqtt";
import { HandleLM35ReceivedDataService } from "@services/mqtt";

const port = env("PORT");
if (!port) throw new Error("No PORT configurated");

app.listen(port, () => console.log(`Server started at ${port}`));

try {
  mqttClient.subscribe({
    [`${TopicsMQTT.RECEIVED_FROM_LM35}`]: {
      qos: 2,
      cb: container.resolve(HandleLM35ReceivedDataService).cb,
    },
  });
} catch (e: any) {
  if (e instanceof AppError) logger.error(e.message);
  else logger.error(`Unknown error on MQTT message callback: ${e.message}`);
}
