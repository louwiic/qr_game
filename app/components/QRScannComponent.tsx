import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useRef} from 'react';
import {Dimensions, Image, StatusBar, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {TouchableOpacity} from 'react-native-gesture-handler';
//import Orientation from 'react-native-orientation';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import {globalStyles} from '../GlobalStyle';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useAPI} from '../../contexts/ApiContext';
import {useLazyQuery} from '@apollo/client';
import {ActivityIndicator} from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';

const haptikOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const ExternalButton = () => {
  return (
    <>
      <View
        style={{
          position: 'absolute',
          top: globalStyles.margin,
          left: globalStyles.margin_large,
          zIndex: 99,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            height: 40,
            width: 40,
          }}>
          <Icon name="times" color="white" size={30} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          position: 'absolute',
          top: globalStyles.margin,
          right: globalStyles.margin_large,
          zIndex: 99,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
        }}>
        <TouchableOpacity
          onPress={() => {
            setFlashlight(!flashlight);
          }}
          style={{
            height: 40,
            width: 40,
          }}>
          <IconMaterial
            name={flashlight ? 'flashlight-off' : 'flashlight'}
            color="white"
            size={30}
          />
        </TouchableOpacity>
      </View>

      {/* <Image
            resizeMode={'contain'}
            style={{
              flex: 1,
              alignSelf: 'center',
              width: Dimensions.get('window').width,
            }}
            source={item.calque}
          /> */}
    </>
  );
};

export const QRScannComponent = ({
  children,
  navigation,
  handleScann,
  refreshScann,
}) => {
  const [flashlight, setFlashlight] = React.useState(false);
  const insets = useSafeAreaInsets();
  const cameraRef = useRef();
  const [resumeScann, setResumeScann] = React.useState(true);
  const [barcodeCodes, setBarCodes] = React.useState(null);
  const [fakeLoading, setFakeLoading] = React.useState(false);
  const route = useRoute();
  //const item = route.params;

  const isSimulator = () => {
    // https://github.com/react-native-community/react-native-device-info#isemulator
    return DeviceInfo.isEmulator();
  };

  React.useEffect(() => {
    setFakeLoading(true);
    const timer = setTimeout(() => {
      setFakeLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const onBarCodeRead = scanResult => {
    ReactNativeHapticFeedback.trigger('notificationSuccess', haptikOptions);

    if (scanResult.data != null) {
      if (!barcodeCodes) {
        setBarCodes({data: scanResult.data, type: scanResult.type});
        setResumeScann(false);
        console.log('resumeScann', resumeScann);
        setTimeout(() => {
          handleScann(scanResult?.data);
          setResumeScann(true);
        }, 800);
      }
    }
  };

  if (fakeLoading) {
    return (
      <View style={{flex: 1, marginTop: insets.top}}>
        <Image style={{}} source={require('../assets/focus.png')} />
        <ActivityIndicator
          style={{
            width: 136,
            height: 136,
            flex: 1,
            borderRadius: 10,
            position: 'absolute',
            alignSelf: 'center',
            top: 0,
            overflow: 'hidden',
          }}
          color="#FFF"
        />
      </View>
    );
  }

  /* 
  borderRadius: 10,
          position: 'absolute',
          alignSelf: 'center',
          top: 10,
          overflow: 'hidden',
          width: "100%",
          height: "100%",
          zIndex:-99
           */

  return (
    <View style={{flex: 1 /* marginTop: insets.top */}}>
     
      <RNCamera
        ref={cameraRef}
        style={{
          flex: 1,
          position: 'absolute',
          alignSelf: 'center',
          top: 0,
          overflow: 'visible',
          width: '100%',
          height: 362,
          zIndex: -99,
        }}
        defaultTouchToFocus
        /* onBarCodeRead={
          resumeScann ? scanResult => onBarCodeRead(scanResult) : null
        } */
        onBarCodeRead={scanResult => onBarCodeRead(scanResult)}
        flashMode={flashlight ? 'torch' : 'off'}
        captureAudio={false}>
        {children}
      </RNCamera>
      <View style={{
          position: 'absolute',
          left: 0,
          top: 0,
          opacity: 0.8,
          //backgroundColor: '#000000',
          borderRadius: 12,
          marginBottom: 30,
          width: 320,
          height: '100%',
        }} />
      
    </View>
  );
};
