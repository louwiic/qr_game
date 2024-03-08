import React from 'react';
import {View} from 'react-native';
import MapView from 'react-native-maps';
import {useContextUser} from '../../../contexts/UserContext';

export const Map = () => {
  const {requestGeoPermission, latLng} = useContextUser();
  const [region, setRegion] = React.useState(null);

  React.useEffect(() => {
    requestGeoPermission();
  }, []);

  React.useEffect(() => {
    if (latLng) {
      setRegion({
        latitude: latLng?.coords?.latitude || 37.78825,
        longitude: latLng?.coords?.longitude || -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [latLng]);

  return (
    <View style={{flex: 1}}>
      <MapView
        style={{
          flex: 1,
        }}
        region={region}
        showsUserLocation
        initialRegion={{
          latitude: latLng?.coords?.latitude || 37.78825,
          longitude: latLng?.coords?.longitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    </View>
  );
};
