import React from 'react';
import { MqttProvider } from '../hooks/mqtt';
import Home from './Home';
import { IClientOptions } from '@taoqf/react-native-mqtt';

const mqttProps: { brokerUrl: string; options: IClientOptions } = {
  brokerUrl: 'ws://broker.mqtt-dashboard.com:8000/mqtt',
  options: {
    port: 8000,
    protocol: 'ws' as 'ws',
    host: 'broker.mqtt-dashboard.com',
    clientId: `LM35-${Math.floor(Math.random() * 100)}`,
    will: {
      topic: 'WillMsg',
      payload: 'Connection Closed abnormally..!',
      qos: 0,
      retain: false,
    },
  },
};

const Main = (): JSX.Element => {
  return (
    <MqttProvider mqttProps={mqttProps}>
      <Home />
    </MqttProvider>
  );
};

export default Main;
