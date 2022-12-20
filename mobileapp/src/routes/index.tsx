import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { IClientOptions } from '@taoqf/react-native-mqtt';
import { MqttProvider } from '../hooks/mqtt';
import { colors } from '../global/colors';
import AppRoutes from './app.routes';

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

const Routes = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (loading || !mqttProps) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>LM35-APP</Text>
        <ActivityIndicator style={styles.loading} size="large" color={'#FFF'} />
      </View>
    );
  }

  return (
    <MqttProvider mqttProps={mqttProps}>
      <AppRoutes />
    </MqttProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.PRIMARY,
  },
  title: {
    fontSize: 52,
    color: '#FFF',
  },
  subtitle: {
    fontSize: 22,
    color: '#FFF',
  },
  loading: {
    paddingTop: 20,
  },
});

export default Routes;
