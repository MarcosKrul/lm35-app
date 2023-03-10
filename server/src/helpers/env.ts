type keys = "PORT" | "MQTT_HOST" | "MQTT_PORT" | "MQTT_SECRET_HASH";

const env = (key: keys): string | undefined => {
  if (!key) return undefined;
  return process.env[key];
};

export { env };
