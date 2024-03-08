import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Map} from '../screens/map/Map';
import {DefaultScreenOptions} from './MainStack';
const Stack = createStackNavigator();

export const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={DefaultScreenOptions}
      initialRouteName="Map"
      gestureEnabled={true}>
      <Stack.Screen
        name="Map"
        component={Map}
        options={{
          headerBackTitle: ' ',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
