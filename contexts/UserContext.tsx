import {useLazyQuery} from '@apollo/client';
import Geolocation from '@react-native-community/geolocation';
import * as React from 'react';
import {Platform} from 'react-native';
import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import {useAPI} from './ApiContext';
import analytics from '@react-native-firebase/analytics';

export const UserContext = React.createContext({});

export const UserProvider = props => {
  const {isConnected, API} = useAPI();
  const [currentUser, {data}] = useLazyQuery(API.CURRENT_USER);
  const [latLng, setLatLng] = React.useState(null);
  const [geoPermission, setGeoPermission] = React.useState(false);

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      pos => {
        setLatLng(pos);
      },
      err => {
        console.error('geoError', err);
      },
      {timeout: 3600},
    );
  };

  React.useEffect(() => {
    if (isConnected) {
      currentUser();
    }
  }, [isConnected]);

  React.useEffect(() => {
    if (data?.currentUser) {
      analytics()
        .setUserProperties(data?.currentUser)
        .then(() => {})
        .catch(err => {
          console.log('err', err);
        });
    }
  }, [data]);

  const findPermissionGranted = permissions => {
    return Object.entries(permissions).find(permission => {
      return permission?.[1] === RESULTS.GRANTED;
    });
  };

  const requestGeoPermission = async () => {
    let granted = false;
    if (Platform.OS === 'android') {
      const permissionsAndroid = await requestMultiple([
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      ]);
      granted = Boolean(findPermissionGranted(permissionsAndroid));
    } else {
      const permissionsiOS = await requestMultiple([
        PERMISSIONS.IOS.LOCATION_ALWAYS,
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      ]);
      granted = Boolean(findPermissionGranted(permissionsiOS));
    }
    setGeoPermission(granted);
  };

  const watchPosition = () => {
    return Geolocation.watchPosition(
      pos => {
        setLatLng(pos);
      },
      () => {},
      {
        distanceFilter: 100,
      },
    );
  };

  const checkPermissions = async () => {
    let granted = false;
    if (Platform.OS === 'ios') {
      const permissionsiOS = await checkMultiple([
        PERMISSIONS.IOS.LOCATION_ALWAYS,
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      ]);
      granted = Boolean(findPermissionGranted(permissionsiOS));
    } else {
      const permissionsAndroid = await checkMultiple([
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]);
      granted = Boolean(findPermissionGranted(permissionsAndroid));
    }
    console.log('granted', granted);

    setGeoPermission(granted);
  };

  React.useEffect(() => {
    if (geoPermission) {
      getCurrentPosition();
    }
  }, [geoPermission]);

  React.useEffect(() => {
    checkPermissions();
  }, []);
  console.log('data?.currentUser', data?.currentUser);

  return (
    <UserContext.Provider
      value={{
        user: data?.currentUser,
        latLng: latLng,
        checkPermissions: checkPermissions,
        requestGeoPermission: requestGeoPermission,
        watchPosition: watchPosition,
      }}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useContextUser = () => React.useContext(UserContext);
