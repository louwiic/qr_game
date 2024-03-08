import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {View, Platform} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {AuthStack} from './AuthStack';
import {useAPI} from '../../contexts/ApiContext';
import SpInAppUpdates from 'sp-react-native-in-app-updates';
import deviceInfoModule from 'react-native-device-info';
import {TabStack} from './TabStack';
import {ProjectsDetails} from '../screens/projects/ProjectDetails';
import {PostDetails} from '../screens/post/PostDetails';
import {requestTrackingPermission} from 'react-native-tracking-transparency';
import analytics from '@react-native-firebase/analytics';
import {AccountStack} from './AccountStack';
import {Enigma} from '../screens/enigma/Enigma';

const Stack = createStackNavigator();

export const DefaultScreenOptions = props => {
  const {navigation} = props || {};
  if (Platform.OS === 'ios') {
    return {
      ...TransitionPresets.SlideFromRightIOS,
      headerTitle: '',
      headerTitleStyle: [{fontSize: 16, letterSpacing: 0.48}],
      cardStyle: {backgroundColor: 'transparent'},
      cardOverlayEnabled: false,
      transparentCard: true,
      presentation: 'transparentModal',
    };
  } else {
    return {
      ...TransitionPresets.SlideFromRightIOS,
      detachPreviousScreen: !navigation?.isFocused(),
      animationTypeForReplace: 'pop',
      headerStatusBarHeight: 24,
      gestureEnabled: true,
      headerTitle: '',
      headerTitleStyle: [{fontSize: 16, letterSpacing: 0.48}],
      cardOverlayEnabled: false,
      transparentCard: true,
    };
  }
};

const config = {
  initialRouteName: 'TabStack',
  screens: {
    ProjectsDetails: 'project/:id',
    PostDetails: 'post/:id',
  },
};
const linking = {
  prefixes: ['starter://'],
  config,
};

export const navigationRef = React.createRef();

export function push(...args) {
  navigationRef.current?.dispatch(StackActions.push(...args));
}

export function navigate(name, params) {
  navigationRef.current.navigate(name, params);
}

export function reset(options) {
  navigationRef?.current?.reset(options);
}

export const MainStack = () => {
  const {theme} = useTheme();
  const {isReady, isConnected} = useAPI();
  const inAppUpdates = new SpInAppUpdates(
    __DEV__, // isDebug
  );

  const appTracking = async () => {
    if (Platform.OS === 'ios') {
      console.log('appTracking');

      const trackingStatus = await requestTrackingPermission();
      console.log('trackingStatus', trackingStatus);
      analytics().setAnalyticsCollectionEnabled(
        trackingStatus === 'authorized' || trackingStatus === 'unavailable',
      );
    }
  };

  const getVersionMinMaj = version => {
    let tab = version?.split('.');
    return {
      minorVersion: tab?.[tab.length - 1],
      majorVersion: tab?.[0],
    };
  };

  const shouldUpdateMajor = (currentVersion, versionStore) => {
    return (
      (currentVersion?.majorVersion || 0) < (versionStore?.majorVersion || 0)
    );
  };
  const checkUpdates = async () => {
    return new Promise((resolve, reject) => {
      inAppUpdates
        .checkNeedsUpdate({
          curVersion: deviceInfoModule.getVersion(),
        })
        .then(result => {
          if (result.shouldUpdate) {
            if (Platform.OS === 'ios') {
              let hasNewMajorVersion = shouldUpdateMajor(
                getVersionMinMaj(deviceInfoModule.getVersion()),
                getVersionMinMaj(result.storeVersion),
              );
              if (hasNewMajorVersion) {
                reject();
              }
              inAppUpdates.startUpdate({
                updateType: hasNewMajorVersion
                  ? IAUUpdateKind.IMMEDIATE
                  : IAUUpdateKind.FLEXIBLE,
                forceUpgrade: hasNewMajorVersion,
              });
              resolve();
            } else {
              inAppUpdates.startUpdate({
                updateType: result.isImmediateUpdateAllowed
                  ? IAUUpdateKind.IMMEDIATE
                  : IAUUpdateKind.FLEXIBLE,
                forceUpgrade: result.isImmediateUpdateAllowed,
              });
              resolve();
            }
          }
        })
        .catch(() => {
          resolve();
        });
    });
  };

  React.useEffect(() => {
    (async () => {
      await checkUpdates();
      appTracking().then(() => {});
    })();
  }, [isReady]);

  if (!isReady) {
    return <View />;
  }

  return (
    <NavigationContainer
      linking={linking}
      onStateChange={async () => {
        const currentRoute = navigationRef.current.getCurrentRoute();
        const id =
          currentRoute?.params?.data?.id || currentRoute?.params?.id || null;

        const name =
          currentRoute?.params?.data?.name ||
          currentRoute?.params?.name ||
          currentRoute?.params?.data?.title ||
          currentRoute?.params?.title ||
          null;
        const current = currentRoute.name;
        /*  try {
          current = I18n.t(currentRoute.name);
        } catch (error) {} */
        if (id) {
          analytics().logEvent(current, {
            id: id,
            name: name,
          });
        } else {
          analytics().logEvent(current);
        }
      }}
      ref={navigationRef}
      theme={theme}>
      <Stack.Navigator
        screenOptions={DefaultScreenOptions}
        initialRouteName={isConnected ? 'TabStack' : 'AuthStack'}>
        <Stack.Screen
          name="AuthStack"
          component={AuthStack}
          options={{
            headerBackTitle: ' ',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="TabStack"
          component={TabStack}
          options={{
            headerBackTitle: ' ',
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="ProjectsDetails"
          component={ProjectsDetails}
          options={{
            headerTitle: '',
            headerBackTitle: ' ',
          }}
        />
        <Stack.Screen
          name="PostDetails"
          component={PostDetails}
          options={{
            headerBackTitle: ' ',
          }}
        />

        <Stack.Screen
          name="Enigma"
          component={Enigma}
          options={{
            headerBackTitle: ' ',
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Profil"
          component={AccountStack}
          options={({route}) => {
            route.params = {
              name: 'Profil',
            };
            return {
              headerTitle: 'Profil',
              headerShown: false,
              tabBarIcon: ({focused}) =>
                getIcon(focused, require('../assets/wallet.png')),
            };
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
