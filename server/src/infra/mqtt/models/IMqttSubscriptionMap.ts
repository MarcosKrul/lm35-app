import mqtt from "mqtt";

interface IMqttSubscriptionMap {
  [topic: string]: {
    qos: mqtt.QoS;
    nl?: boolean;
    rap?: boolean;
    rh?: number;
    cb: (payload: Buffer) => void;
  };
}

export { IMqttSubscriptionMap };
