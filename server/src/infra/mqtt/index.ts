import { MqttClient } from "./client";
import { IBaseMQTTService } from "./models/IBaseMQTTService";

const mqttClient = new MqttClient();

export { mqttClient, IBaseMQTTService };
