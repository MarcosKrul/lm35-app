import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from 'react';
import mqtt, {
  ClientSubscribeCallback,
  IClientOptions,
  IClientPublishOptions,
  IClientSubscribeOptions,
  MqttClient,
  Packet,
  PacketCallback,
} from '@taoqf/react-native-mqtt';

import { Buffer } from 'buffer';
import { Alert } from 'react-native';
global.Buffer = Buffer;

interface MqttContextData {
  publish(
    topic: string,
    message: string | Buffer,
    opts: IClientPublishOptions,
    // callback: (
    //   topic_: string,
    //   payload: Buffer,
    //   packet: Packet,
    //   error?: Error
    // ) => void
  ): void;
  subscribe(
    topic: string | string[],
    opts: IClientSubscribeOptions,
    callback?: ClientSubscribeCallback,
    // callback?: (
    //   topic_: string,
    //   payload: Buffer,
    //   packet: Packet,
    //   error: Error
    // ) => void
  ): void;
  unsubscribe(
    topic_: string | string[],
    opts?: Record<string, unknown> | undefined,
    callback?: PacketCallback | undefined,
  ): MqttClient;
  onMessage(topic_: string, payload: Buffer, packet: Packet): void;
  clientMqtt: MqttClient;
  payload: Buffer;
  status: boolean;
  reconNumber: number;
}

export interface MqttProps {
  brokerUrl?: string;
  options: IClientOptions;
}

interface MqttProviderProps {
  mqttProps: MqttProps;
  children?: React.ReactNode;
}

const MqttContext = createContext<MqttContextData>({} as MqttContextData);

export const MqttProvider = ({
  children,
  mqttProps,
}: MqttProviderProps): JSX.Element => {
  const [clientMqtt] = useState<MqttClient>(() =>
    mqtt.connect(mqttProps.brokerUrl, mqttProps.options),
  );
  const [payload, setPayload] = useState<Buffer>();
  const [status, setStatus] = useState<boolean>(false);
  const [reconNumber, setReconNumber] = useState<number>(0);
  const reconTries = useRef(0);

  useEffect(() => {
    clientMqtt.on('connect', () => {
      console.log('CONNECTED');
      setStatus(true);
    });

    clientMqtt.on('reconnect', (a: any, b: any) => {
      if (reconTries.current >= 5) {
        reconTries.current = 0;
        setReconNumber(0);
        clientMqtt.end(true);
        setStatus(false);
        return;
      }
      setStatus(false);
      setReconNumber(reconTries.current + 1);
      reconTries.current = reconTries.current + 1;
      console.log('Reconnecting', a, b);
    });

    clientMqtt.on('error', err => {
      setStatus(false);
      console.error('Connection error: ', err);
      clientMqtt.end();
    });

    clientMqtt.on('end', () => {
      setStatus(false);
      console.log('Connection Ended');
      clientMqtt.end();
    });

    clientMqtt.on('disconnect', (packet: Packet) => {
      setStatus(false);
      console.error('Disconnecting: ', packet);
      clientMqtt.end();
    });
    clientMqtt.on('message', (topic_: string, payloadF: Buffer) =>
      onMessage(topic_, payloadF),
    );
  }, [clientMqtt]);
  const unsubscribe = (
    topic_: string | string[],
    opts?: Record<string, unknown> | undefined,
  ): MqttClient => {
    clientMqtt.unsubscribe(topic_, { ...opts });
    return clientMqtt;
  };

  const publish = (
    topic: string,
    message: string | Buffer,
    opts: IClientPublishOptions,
    // callback: (
    //   topic_: string,
    //   payload: Buffer,
    //   packet: Packet,
    //   error?: Error
    // ) => void
  ) => {
    clientMqtt.publish(topic, message, opts, error => {
      if (error) {
        Alert.alert(
          'Erro',
          'Ocorreu um erro inesperado durante a publicação. Tente novamente.',
        );
      }
      // clientMqtt.on(
      //   'message',
      //   (topic_: string, payload: Buffer, packet_: Packet) => {
      //     callback(topic_, payload, packet_, error)
      //   }
      // )
    });
  };

  const subscribe = (
    topic: string | string[],
    opts: IClientSubscribeOptions,
    callback?: ClientSubscribeCallback,
  ) => {
    clientMqtt.subscribe(topic, { ...opts }, callback);
  };

  const onMessage = (topic_: string, payloadD: Buffer): void => {
    setPayload(payloadD);
  };

  return (
    <MqttContext.Provider
      value={{
        publish,
        subscribe,
        unsubscribe,
        onMessage,
        clientMqtt,
        payload: payload as Buffer,
        status,
        reconNumber,
      }}>
      {children}
    </MqttContext.Provider>
  );
};

export function useMqtt(): MqttContextData {
  const context = useContext(MqttContext);

  if (!context) {
    throw new Error('useMqtt must be used within an MqttProvider');
  }

  return context;
}
