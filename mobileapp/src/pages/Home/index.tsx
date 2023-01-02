import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useMqtt } from '../../hooks/mqtt';
import { styles } from './styles';

type MessagePayload = {
  milliVolts: string;
  analog: string;
  temp: string;
};

const Home = (): JSX.Element => {
  const { subscribe, unsubscribe, payload, publish } = useMqtt();
  const [analogValue, setAnalogValue] = useState<string>('0');
  const [tempValue, setTempValue] = useState<string>('0');
  const [tensionValue, setTensionValue] = useState<string>('0');
  const [brokerStopped, setBrokerStopped] = useState<boolean>(false);
  const [freqValue, setFreqValue] = useState<string>('1');

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
      const parsedValues: MessagePayload = JSON.parse(payload.toString());

      setAnalogValue(prev => parsedValues.analog ?? prev);
      setTempValue(prev => parsedValues.temp ?? prev);
      setTensionValue(
        prev =>
          `${(Number(parsedValues.milliVolts) / 1000).toFixed(3)}` ?? prev,
      );
    }
  }, [payload]);

  const toggleMessages = (): void => {
    publish(
      '/mqtt/engcomp/lm35/0a6e2389ec3fecd2a8068a0097ef5f96/control/toggle',
      '',
      { qos: 2 },
    );
    setBrokerStopped(prev => !prev);
  };

  const selectFreq = (value: string): void => {
    setFreqValue(value);
    publish(
      '/mqtt/engcomp/lm35/0a6e2389ec3fecd2a8068a0097ef5f96/control/frequency',
      value,
      { qos: 2 },
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Bem-vindo</Text>

        <TouchableOpacity onPress={toggleMessages}>
          <Text style={styles.toggle}>
            {brokerStopped ? 'Ligar' : 'Desligar'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.valuesContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Frequência</Text>
          <Picker
            style={styles.picker}
            selectedValue={freqValue}
            onValueChange={itemValue => selectFreq(itemValue)}>
            <Picker.Item label="Instantâneo" value="0" />
            <Picker.Item label="1 segundo" value="1" />
            <Picker.Item label="2 segundos" value="2" />
            <Picker.Item label="5 segundos" value="5" />
          </Picker>
        </View>
        <View style={styles.analogContainer}>
          <Text style={styles.analogLabel}>Valor de tensão</Text>
          <Text style={styles.value}>{`${tensionValue} V`}</Text>
        </View>
        <View style={styles.analogContainer}>
          <Text style={styles.analogLabel}>Valor analógico</Text>
          <Text style={styles.value}>{`${analogValue.split('.')[0]}`}</Text>
        </View>
        <View style={styles.tempContainer}>
          <Text style={styles.tempLabel}>Temperatura</Text>
          <Text style={styles.value}>{`${tempValue} °C`}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
