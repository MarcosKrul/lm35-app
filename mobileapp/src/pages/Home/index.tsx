import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useMqtt } from '../../hooks/mqtt';
import { styles } from './styles';

const Home = (): JSX.Element => {
  const { subscribe, unsubscribe, payload } = useMqtt();

  useEffect(() => {
    subscribe('/mqtt/engcomp/lm35/0a6e2389ec3fecd2a8068a0097ef5f96/diffusion', {
      qos: 1,
      nl: true,
    });

    return () => {
      unsubscribe(
        '/mqtt/engcomp/lm35/0a6e2389ec3fecd2a8068a0097ef5f96/diffusion',
      );
    };
  }, [subscribe, unsubscribe]);

  useEffect(() => {
    if (payload) {
      console.log(payload.toString());
    }
  }, [payload]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bem-vindo(a)</Text>
    </View>
  );
};

export default Home;
