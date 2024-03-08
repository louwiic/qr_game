import {useLazyQuery} from '@apollo/client';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Image, View} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';
import {useAlert} from '../../contexts/AlertContext';
import {useAPI} from '../../contexts/ApiContext';
import {useTheme} from '../../contexts/ThemeContext';
import BackgroundGradient from '../components/BackgrounGradient';
import {Loader} from '../components/partials/Loader';
import {WebPageView} from '../components/WebviewComponent';
import {Account} from '../screens/account/Account';
import {EditAccount} from '../screens/account/EditAccount';
import {Enigma} from '../screens/enigma/Enigma';
import ErrorQRScann from '../screens/home/ErrorQRScann';
import {Home} from '../screens/home/Home';
import WaitingList from '../screens/home/WaitingList';
import {DefaultScreenOptions} from './MainStack';
const Stack = createStackNavigator();

export const HomeStack = () => {
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
    }, 2200);
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
      //initialRouteName={'WaitingList'}
      initialRouteName={
        currentPositionInList?.in_waiting ? 'WaitingList' : 'Home'
      }
      gestureEnabled={true}>
      <Stack.Screen
        name="WaitingList"
        component={WaitingList}
        options={{
          headerBackTitle: '',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerBackTitle: '',
          headerShown: false,
          cardStyle: {backgroundColor: 'transparent'},
          cardOverlayEnabled: true,
          cardStyleInterpolator: ({current: {progress}}) => ({
            cardStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 0.5, 0.9, 1],
                outputRange: [0, 0.25, 0.7, 1],
              }),
            },
            overlayStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
                extrapolate: 'clamp',
              }),
            },
          }),
        }}
      />

      <Stack.Screen
        name="Profil"
        component={Account}
        options={{
          headerBackTitle: '',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ErrorQRScann"
        component={ErrorQRScann}
        options={{
          headerBackTitle: '',
          headerShown: false,
          cardStyle: {backgroundColor: 'transparent'},
          cardOverlayEnabled: true,
          cardStyleInterpolator: ({current: {progress}}) => ({
            cardStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 0.5, 0.9, 1],
                outputRange: [0, 0.25, 0.7, 1],
              }),
            },
            overlayStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 0],
                outputRange: [0, 0],
                extrapolate: 'clamp',
              }),
            },
          }),
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
      {/*  <Stack.Screen
        name="Enigma"
        component={Enigma}
        options={{
          headerBackTitle: ' ',
          headerShown: false,
        }}
      /> */}

      <Stack.Screen
        name="WebPageView"
        component={WebPageView}
        options={({navigation}) => ({
          title: 'WebView',
          headerRight: () => <View />,
          headerStyle: {
            backgroundColor:"#FFF",
          },
          headerTintColor: '#FFFFFF',
          headerBackTitleVisible: false,
          headerShown: true,
          headerLeftContainerStyle: {marginLeft: 15},
          headerRightContainerStyle: {marginRight: 15},
        })}
      />

      {/* <Stack.Screen
        name="Signup"
        component={Signup}
        options={{
          headerBackTitle: ' ',
          headerTitle: "S'enregistrer",
          headerShown: false,
        }}
      /> */}
    </Stack.Navigator>
  );
};
