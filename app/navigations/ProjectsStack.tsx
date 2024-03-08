import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Projects} from '../screens/projects/Projects';
import {DefaultScreenOptions} from './MainStack';
const Stack = createStackNavigator();

export const ProjectsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={DefaultScreenOptions}
      initialRouteName="Projects"
      gestureEnabled={true}>
      <Stack.Screen
        name="Projects"
        component={Projects}
        options={{
          headerBackTitle: ' ',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
