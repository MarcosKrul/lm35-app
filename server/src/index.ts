import "reflect-metadata";
import "express-async-errors";
import "@containers/index";

import { container } from "tsyringe";

import { TopicsMQTT } from "@common/TopicsMQTT";
import { env } from "@helpers/env";
import { app } from "@infra/http/app";
import { mqttClient } from "@infra/mqtt";
import { HandleLM35ReceivedDataService } from "@services/mqtt";

const port = env("PORT");
if (!port) throw new Error("No PORT configurated");

app.listen(port, () => console.log(`Server started at ${port}`));

mqttClient.subscribe({
  [`${TopicsMQTT.RECEIVED_FROM_LM35}`]: {
    qos: 2,
    cb: container.resolve(HandleLM35ReceivedDataService).cb,
  },
});
