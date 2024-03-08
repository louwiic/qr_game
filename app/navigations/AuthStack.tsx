import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {Login} from '../screens/auth/Login';
import {LostPassword} from '../screens/auth/LostPassword';
import {NewPassword} from '../screens/auth/NewPassword';
import {Signup} from '../screens/auth/Signup';
import {DefaultScreenOptions} from './MainStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VerifyPhone } from '../screens/auth/VerifyPhone';

const Stack = createStackNavigator();

export const AuthStack = () => {
  const [displayTutorial, setDisplayTutorial] = React.useState({
    firstLaunched: 'true',
  });

  useEffect(() => {
    checkFirstKey();
  }, []);

  const checkFirstKey = async () => {
    const k = await AsyncStorage.getItem('firstLaunchKey');

    if (k === null) {
      await AsyncStorage.setItem('firstLaunchKey', 'true');
      setDisplayTutorial({firstLaunched: 'true'});
    } else {
      setDisplayTutorial({firstLaunched: k});
    }
  };

  const onLoadTutorial = async state => {
    await AsyncStorage.setItem('firstLaunchKey', state);
    const k = await AsyncStorage.getItem('firstLaunchKey');
    setDisplayTutorial({firstLaunched: k});
  };

  console.log('displayTutorial', displayTutorial.firstLaunched);

  return (
    <Stack.Navigator
      screenOptions={DefaultScreenOptions}
      initialRouteName={
        displayTutorial.firstLaunched === 'true' ? 'Onboarding' : 'Login'
      }>
      {/*  <Stack.Screen
        name="Onboarding"
        //component={Onboarding}
        options={{
          headerBackTitle: ' ',
          headerShown: false,
        }}>
        {() => <Onboarding onLoadTutorial={onLoadTutorial} />}
      </Stack.Screen> */}

      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{
          headerBackTitle: ' ',
          headerTitle: "S'enregistrer",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="LostPassword"
        component={LostPassword}
        options={{
          headerBackTitle: ' ',
          headerTitle: 'Mot de passe perdu',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="NewPassword"
        component={NewPassword}
        options={{
          headerBackTitle: ' ',
          headerTitle: 'Mot de passe perdu',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="VerifyPhone"
        component={VerifyPhone}
        options={{
          headerBackTitle: ' ',
          headerTitle: 'V',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
