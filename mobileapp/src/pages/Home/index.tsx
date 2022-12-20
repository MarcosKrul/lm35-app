import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useMqtt } from '../../hooks/mqtt';
import { styles } from './styles';

const Home = (): JSX.Element => {
  const { subscribe, unsubscribe, payload, publish } = useMqtt();
  const [analogValue, setAnalogValue] = useState<string>('0');
  const [tempValue, setTempValue] = useState<string>('0');
  const [brokerStopped, setBrokerStopped] = useState<boolean>(false);

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
      const parsedValues: { temp: string; analog: string } = JSON.parse(
        payload.toString(),
      );

      setAnalogValue(prev => parsedValues.analog ?? prev);
      setTempValue(prev => parsedValues.temp ?? prev);
    }
  }, [payload]);

  const getRawValue = (analog: number): string =>
    `${((analog * 5.0) / 1024).toFixed(2)}`;

  const toggleMessages = (): void => {
    publish(
      '/mqtt/engcomp/lm35/0a6e2389ec3fecd2a8068a0097ef5f96/control/toggle',
      '',
      { qos: 2 },
    );
    setBrokerStopped(prev => !prev);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Bem-vindo</Text>
        <TouchableOpacity onPress={toggleMessages}>
          <Text style={styles.toggle}>
            {brokerStopped ? 'Ligar' : 'Desligar'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.valuesContainer}>
        <View style={styles.analogContainer}>
          <Text style={styles.analogLabel}>Valor de tensão</Text>
          <Text style={styles.value}>{`${getRawValue(
            Number(analogValue),
          )} V`}</Text>
        </View>
        <View style={styles.analogContainer}>
          <Text style={styles.analogLabel}>Valor analógico</Text>
          <Text style={styles.value}>{`${analogValue}`}</Text>
        </View>
        <View style={styles.tempContainer}>
          <Text style={styles.tempLabel}>Temperatura</Text>
          <Text style={styles.value}>{`${tempValue} °C`}</Text>
        </View>
      </View>
    </View>
  );
};

export default Home;
