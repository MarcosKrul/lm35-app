import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

const Home = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bem-vindo(a)</Text>
    </View>
  );
};

export default Home;
