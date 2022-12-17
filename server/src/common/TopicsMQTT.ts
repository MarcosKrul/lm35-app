import { env } from "@helpers/env";

class TopicsMQTT {
  public static readonly RECEIVED_FROM_LM35: string = `/mqtt/engcomp/lm35/${env(
    "MQTT_SECRET_HASH"
  )}/diffusion`;
}

export { TopicsMQTT };
