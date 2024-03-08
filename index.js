/**
 * @format
 */

import {AppRegistry} from 'react-native';
import React from 'react';
import {name as appName} from './app.json';
import {App} from './App';
import {ThemeProvider} from './contexts/ThemeContext';
import {APIProvider} from './contexts/ApiContext';
import 'moment/locale/fr';
import 'moment/locale/de';
import 'moment/locale/it';
import 'moment/locale/pt';
import 'moment/locale/es';
import moment from 'moment';
import {UserProvider} from './contexts/UserContext';
import 'react-native-gesture-handler';
import notifee from '@notifee/react-native';
import {handlerNotification} from './app/utils/globals';
moment.locale('fr');
global.Log = (key, string) => {
  /* if (__DEV__) {
    if (key && string) {
      console.log(key, string);
    } else if (key) {
      console.log(string);
    }
  } */
};

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification} = detail;
  const data = notification?.data;
  handlerNotification(data);
});

const ContextUser = () => {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
};

const MyApp = () => {
  return (
    <APIProvider>
      <ThemeProvider>
        <ContextUser />
      </ThemeProvider>
    </APIProvider>
  );
};

AppRegistry.registerComponent(appName, () => MyApp);
