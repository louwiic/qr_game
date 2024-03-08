import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {ProjectsStack} from './ProjectsStack';
import {HomeStack} from './HomeStack';
import {DefaultScreenOptions} from './MainStack';
import {AccountStack} from './AccountStack';
import messaging from '@react-native-firebase/messaging';

import notifee, {
  AndroidImportance,
  AndroidStyle,
  EventType,
} from '@notifee/react-native';
import {handlerNotification} from '../utils/globals';
import {Map} from '../screens/map/Map';
import SplashScreen from 'react-native-splash-screen';
import {CustomTabBar} from '../components/partials/CustomTab';

export const TabStack = () => {
  const Tab = React.useRef(createBottomTabNavigator()).current;
  const {colors} = useTheme();

  const getIcon = React.useCallback(
    (focused, source) =>
      focused ? (
        <Image
          key="selected"
          source={source}
          style={{
            tintColor: colors.white,
          }}
        />
      ) : (
        <Image
          source={source}
          style={{
            tintColor: colors.white,
          }}
        />
      ),
    [colors],
  );

  const getFcmToken = async () => {
    const firebaseToken = await messaging().getToken();
    if (firebaseToken) {
      console.log(firebaseToken);

      //store('firebaseToken', firebaseToken);
    }
  };

  const requestUserPermission = async () => {
    const authorizationStatus =
      Platform.OS === 'ios' ? await messaging().requestPermission() : true;
    if (authorizationStatus) {
      await messaging().registerDeviceForRemoteMessages();
      await getFcmToken();
    }
  };

  React.useEffect(() => {
    SplashScreen.hide();
    (async () => {
      await requestUserPermission();
    })();
    messaging().setBackgroundMessageHandler(() => {});
    notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.PRESS:
          handlerNotification(detail.notification?.data);
          break;
      }
    });
    messaging().onNotificationOpenedApp(remote => {
      handlerNotification(remote?.data);
    });
    messaging().onMessage(async remoteMessage => {
      const channelId = await notifee.createChannel({
        id: 'channel_starter',
        name: 'channel_starter',
        vibration: true,
        importance: AndroidImportance.HIGH,
      });
      await notifee.displayNotification({
        android: {
          channelId: channelId,
          color: '#FFFFFF',
          style: {
            text: remoteMessage.notification.body,
            type: AndroidStyle.BIGTEXT,
          },
        },
        body: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
        data: remoteMessage.data,
      });
    });
    messaging()
      .getInitialNotification()
      ?.then(remote => {
        handlerNotification(remote?.data);
      });
  }, []);

  return (
    <Tab.Navigator
      onNav
      shifting={false}
      tabBar={props => (
        <CustomTabBar
          keyExtractor={(item, index) => index.toString()}
          {...props}
        />
      )}
      //activeTintColor={colors.activeColor}
      //inactiveTintColor={colors.grayLight}
      initialRouteName={'Accueil'}
      screenOptions={DefaultScreenOptions}
      barStyle={{
        backgroundColor: 'transparent',
        paddingHorizontal: 20,
      }}>
      <Tab.Screen
        name="Projets"
        component={ProjectsStack}
        options={({}) => {
          return {
            headerTitle: 'Projet',
            headerShown: false,
            tabBarIcon: ({focused}) =>
              getIcon(focused, require('../assets/home.png')),
          };
        }}
      />
      <Tab.Screen
        name="Accueil"
        component={HomeStack}
        options={({}) => {
          return {
            headerTitle: 'Accueil',
            headerShown: false,
            tabBarIcon: ({focused}) =>
              getIcon(focused, require('../assets/Scan.png')),
          };
        }}
      />
      {/* <Tab.Screen
        name="Map"
        component={Map}
        options={({}) => {
          return {
            headerTitle: 'Map',
            tabBarIcon: ({focused}) =>
              getIcon(focused, require('../assets/suivi.png')),
          };
        }}
      /> */}
      <Tab.Screen
        name="Wallet"
        component={AccountStack}
        options={({route}) => {
          route.params = {
            name: 'Wallet',
          };
          return {
            headerTitle: 'Porte feuille',
            headerShown: false,
            tabBarIcon: ({focused}) =>
              getIcon(focused, require('../assets/wallet.png')),
          };
        }}
      />
    </Tab.Navigator>
  );
};
