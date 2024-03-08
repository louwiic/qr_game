import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {WebPageView} from '../components/WebviewComponent';
import {Account} from '../screens/account/Account';
import {EditAccount} from '../screens/account/EditAccount';
import {DefaultScreenOptions} from './MainStack';

import {useLazyQuery} from '@apollo/client';
import {Image, View} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';
import {useAlert} from '../../contexts/AlertContext';
import {useAPI} from '../../contexts/ApiContext';
import {useTheme} from '../../contexts/ThemeContext';
import BackgroundGradient from '../components/BackgrounGradient';
import WaitingList from '../screens/home/WaitingList';

const Stack = createStackNavigator();

export const AccountStack = () => {
  const {colors} = useTheme();
  const {API} = useAPI();
  const {alert, close} = useAlert();

  const [currentPositionInList, setCurrentPositionInList] = React.useState({});
  const [fakeLoading, setFakeLoading] = React.useState(false);

  const [currentUser, {data: data_user, error, loading: ld}] = useLazyQuery(
    API.WAITING_POSITION,
  );

  React.useEffect(() => {
    currentUser();
  }, []);

  React.useEffect(() => {
    if (data_user) {
      setCurrentPositionInList(data_user?.currentUser?.waiting_list);
    }
  }, [data_user]);

  React.useEffect(() => {
    setFakeLoading(true);
    setTimeout(() => {
      setFakeLoading(false);
    }, 1600);
  }, []);

  if (fakeLoading) {
    return (
      <BackgroundGradient>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image source={require('../assets/logo_waitinglist.png')} />
          <View style={{marginTop: 10}}>
            <Text style={{fontSize: 16}}>Chargement</Text>
            <ActivityIndicator style={{marginTop: 10}} color={'#FFF'} />
          </View>
        </View>
      </BackgroundGradient>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={DefaultScreenOptions}
      initialRouteName={
        currentPositionInList?.in_waiting ? 'WaitingList' : 'Account'
      }>
      <Stack.Screen
        name="WaitingList"
        component={WaitingList}
        options={{
          headerBackTitle: '',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Account"
        component={Account}
        options={{
          headerBackTitle: ' ',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="EditAccount"
        component={EditAccount}
        options={{
          headerBackTitle: ' ',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="WebPageView"
        component={WebPageView}
        options={{
          headerBackTitle: ' ',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
