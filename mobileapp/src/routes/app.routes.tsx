import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../pages/Home';
import { colors } from '../global/colors';

export type StackAppParams = {
  Home: {
    id?: number;
  };
};

const Stack = createNativeStackNavigator<StackAppParams>();

const AppRoutes = (): JSX.Element => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          //headerShown: false,
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: colors.PRIMARY,
          },
          animation: 'fade',
        }}>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppRoutes;
