import {useLazyQuery, useQuery} from '@apollo/client';
import React, {useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  Touchable,
  View,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Animated, {useSharedValue} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BaseURL, useAPI} from '../../../contexts/ApiContext';
import BackgroundGradient from '../../components/BackgrounGradient';
import {ImageRemote} from '../../components/ImageRemote';
import {QRScannComponent} from '../../components/QRScannComponent';
import {globalStyles} from '../../GlobalStyle';
import {navigate} from '../../navigations/MainStack';
import {TapGestureHandler} from 'react-native-gesture-handler';
import usePrice from '../../hooks/usePrice';
import TextGradient from '../../components/TextGradient';
import I18n from 'i18n-js';
import {useTheme} from '../../../contexts/ThemeContext';
import {HelperText} from 'react-native-paper';
import {Icon} from 'react-native-paper/lib/typescript/components/Avatar/Avatar';
import {useFocusEffect} from '@react-navigation/native';
import {useCountUp} from 'use-count-up';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export const Home = ({navigation}) => {
  const translationY = useSharedValue(0);
  const {colors} = useTheme();
  const [avatarDefault, setAvatarDefault] = useState(true);
  const {API} = useAPI();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState({});
  const {localPrice} = usePrice();
  const [loadingOpenEnigma, setLoadingOpenEnigma] = useState(false);

  const [currentUser, {data: data_user, error, loading: ld}] = useLazyQuery(
    API.USER_HOME_PROFIL,
  );
  const {data, loading} = useQuery(API.PROJECT_LIST, {
    variables: {
      offset: 0,
      limit: 3,
    },
  });
  const {data: data2, loading: loading2} = useQuery(API.PROJECT_LIST, {
    variables: {
      offset: 0,
      limit: 4,
    },
  });

  //counter
  const {value} = useCountUp({
    isCounting: user?.gain_of_the_day ? true : false,
    end: user?.gain_of_the_day,
    duration: 3.2,
  });

  React.useEffect(() => {
    currentUser();
  }, []);

  React.useEffect(() => {
    if (data_user) {
      setUser(data_user?.currentUser);
    }
  }, [data_user]);

  const dataFlatList = React.useMemo(() => {
    let array = [];

    const responseProjects = data;
    const responseProjects2 = data2;

    if (responseProjects?.projectsList?.projects?.length > 0) {
      array = [
        ...array,
        {
          orientation: 'horizontal',
          title: 'Derniers arrivant',
          buttonTitle: 'Découvrir',
          buttonPress: () => {
            navigate('Projets');
          },
          items: responseProjects?.projectsList?.projects?.map(item => {
            return {
              item: item,
              template: 'user',
            };
          }),
        },
      ];
    }
    if (responseProjects2?.projectsList?.projects?.length > 0) {
      array = [
        ...array,
        {
          orientation: 'vertical',
          title: 'Entrainement disponible',
          buttonTitle: 'Voir tout',
          buttonPress: () => {
            navigate('Projets');
          },
          items: responseProjects2?.projectsList?.projects?.map(item => {
            return {
              item: item,
              template: 'training',
            };
          }),
        },
      ];
    }

    return array;
  }, [data, data2]);

  const handleAvatar = () => {
    //setAvatarDefault(!avatarDefault) //display gold account
    navigate('Profil');
  };

  const handleInfoGainOfTheDay = () => {
    const navOptions = {
      title: 'Nous écrire',
      color: colors.backgroundColor,
      url: 'https://www.qrwin.fr/information',
    };
    //navigation.navigate("WebPageView", navOptions)

    Alert.alert(
      'INFOS GAINS DU JOUR',
      'Scannez les QR Codes des entreprises partenaires et répondez à leurs énigmes \n \n Chaque bonne réponse vous donnera des QR Coins qui seront converti en € dans votre Wallet à la fin de chaque jour',
      [
        {
          text: 'En savoir plus',
          onPress: () => navigation.navigate('WebPageView', navOptions),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => {}},
      ],
    );
  };

  const [resumScann, setResumeScann] = useState(true);
  const [showErrorQR, setShowErrorQR] = useState(false);
  const [QRValid, setQRValid] = useState(null);
  const [storeScan, {data: data_enigma, error: err_storescann}] = useLazyQuery(
    API.CHECK_QR,
    {
      onCompleted: result => {
        if (result?.storeScan?.id) {
          navigation.reset({
            index: 0,
            routes: [
              {name: 'TabStack'},
              {
                name: 'Enigma',
                params: {
                  barreCode: result?.storeScan?.id,
                  resumeScann: () => {
                    setResumeScann(true);
                  },
                },
              },
            ],
          });
        } else if (result?.storeScan === null) {
          setShowErrorQR(true);
          navigation.navigate('ErrorQRScann');
        }
      },
    },
  );

  const handleScann = barreCode => {
    storeScan({variables: {id: barreCode}});
  };

  return (
    <View style={{height: '100%'}}>
      <BackgroundGradient>
        <View
          style={{
            height: 362,
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}>
          <Image
            source={require('../../assets/bg_home.png')}
            style={{
              width: '100%',
              height: 362,
            }}
          />

          <View
            style={{
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              left: 0,
              right: 0,
              zIndex: 1,
            }}>
            {/* Icon & cloche notif */}

            {/* Camera scann */}
            {resumScann && (
              <QRScannComponent
                handleScann={handleScann}
                navigation={navigation}
                refreshScann={resumScann}
                handleErrorQR={state => {
                  setShowErrorQR(state);
                }}>
                <SafeAreaView
                  style={{
                    height: 48,
                    // width: '90%',
                    marginTop:insets.top,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    zIndex: 1,
                  }}>
                  <View>
                    {/* icon cloche here */}
                    <TouchableOpacity>
                      <Image
                        style={{}}
                        source={require('../../assets/bell_notif.png')}
                      />
                      {user?.unread_notifications > 0 && (
                        <Image
                          style={{position: 'absolute', top: 6, right: 8}}
                          source={require('../../assets/icon_notif.png')}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                  <View >
                    {/* Focus */}
                    <Image
                      style={{marginTop: '40%'}}
                      source={require('../../assets/focus.png')}
                    />                    
                    <View style={styles.overlay} />                         
                    {showErrorQR && (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: 5,
                        }}>
                        {/* <Image style={{backgroundColor:"red", marginRight:-20}} source={require('../../assets/close.png')} /> */}
                        <HelperText
                          type="info"
                          theme={{colors: {text: colors.red}}}
                          style={{fontSize: 15, color: colors.red}}
                          visible={true}>
                          QR Code non recnonnu
                        </HelperText>
                      </View>
                    )}                               
                  </View>
                  <View>
                    {/* Avatar */}
                    <TouchableOpacity
                      onPress={() => {
                        handleAvatar();
                      }}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        //zIndex: 4,
                      }}>
                      {user?.is_premium ? (
                        <Image
                          style={{}}
                          source={require('../../assets/avatarGold.png')}
                        />
                      ) : (
                        <Image
                          style={{}}
                          source={require('../../assets/avatarWhite.png')}
                        />
                      )}
                      <ImageRemote
                        //noFast={true}
                        style={{
                          width: 40,
                          height: 40,
                          position: 'absolute',
                          borderRadius: 20,
                        }}
                        source={{uri: BaseURL + user?.avatar}}
                      />
                    </TouchableOpacity>
                  </View>
                </SafeAreaView>
              </QRScannComponent>
            )}
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          pointerEvents="box-none"
          bounces={false}
          style={{zIndex: 2, marginTop: 80 + insets.top, overflow: 'visible'}}>
          <View
            pointerEvents="box-none"
            style={{
              backgroundColor: 'transparent',
              width: '100%',
              height: 282 - insets.top,
              //marginTop: 98,
            }}
          />
          <View style={{}}>
            <Image
              style={{
                position: 'absolute',
                width: '100%',
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                marginTop: -28,
                // marginTop: -116,
              }}
              source={require('../../assets/bg.png')}
            />
            <View style={{alignItems: 'center'}}>
              {/* Offer */}
              <Image
                style={{marginTop: '8%'}}
                source={
                  user?.is_premium
                    ? require('../../assets/premOfferActive.png')
                    : require('../../assets/premOffer.png')
                }
              />
              {/* gain */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 50,
                }}>
                <TextGradient
                  style={{
                    fontFamily: globalStyles.bold.fontFamily,
                    fontSize: 24,
                    fontWeigth: 700,
                  }}>
                  GAINS DU JOUR
                </TextGradient>
                <Pressable
                  onPress={() => handleInfoGainOfTheDay()}
                  style={{marginLeft: 5}}>
                  <Image source={require('../../assets/info_circle.png')} />
                </Pressable>
              </View>
              <View
                style={{
                  marginTop: 9,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{}}
                  source={require('../../assets/gainPlaceholer.png')}
                />
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#FFF',
                    position: 'absolute',
                    fontFamily: globalStyles.ethnocentric.fontFamily,
                    fontSize: 32,
                    paddingRight: 40,
                  }}>
                  {user?.gain_of_the_day ? value : user?.gain_of_the_day}
                </Text>
              </View>
              {/* Wallet */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '9%',
                  height: 24,
                }}>
                <Image style={{}} source={require('../../assets/wallet.png')} />
                <Text style={styles.walletText}>
                  Wallet :{' '}
                  <Text style={[globalStyles.medium]}>
                    {localPrice(user?.wallet_amount)}
                  </Text>
                </Text>
              </View>
            </View>
            <View style={{height: 85}} />
          </View>
        </ScrollView>
      </BackgroundGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
  },
  item: {
    borderWidth: 4,
    borderColor: 'rgba(0,0,0,0.2)',
    height: 48,
    width: 48,
    borderRadius: 8,
  },
  overlay: {
    position: 'absolute',
    alignSelf: 'center',
    top: 74,
    borderRadius: 10,
    /* right: 0,
    bottom: 0,
    left: 0, */
    width: 132,
    height: 132,
    backgroundColor: '#FFF',
    opacity: 0.2,
  },
  walletText: {
    color: '#FFF',
    fontFamily: globalStyles.light.fontFamily,
    fontSize: 16,
    marginLeft: 8,
  },
});
