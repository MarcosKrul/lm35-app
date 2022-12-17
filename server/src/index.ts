import { TopicsMQTT } from "@common/TopicsMQTT";
import { env } from "@helpers/env";
import { app } from "@infra/http/app";
import { mqttClient } from "@infra/mqtt";

const port = env("PORT");
if (!port) throw new Error("No PORT configurated");

app.listen(port, () => console.log(`Server started at ${port}`));

mqttClient.subscribe({
  [`${TopicsMQTT.RECEIVED_FROM_LM35}`]: {
    qos: 2,
    cb: (payload) => {
      console.log(`Dados recebido do sensor LM35: ${payload.toString()}`);
    },
  },
});
