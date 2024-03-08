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

export default WaitingList = ({navigation}) => {
  const translationY = useSharedValue(0);
  const {colors} = useTheme();
  const [avatarDefault, setAvatarDefault] = useState(true);
  const {API} = useAPI();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState({});
  const {localPrice} = usePrice();

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
      url: 'https://www.google.fr',
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

  return (
    <View style={{flex: 1}}>
      <BackgroundGradient>
        <SafeAreaView
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            marginTop:insets.top,
          }}>
          {/* Icon & cloche notif */}
          <View
            style={{
              height: 48,
              width: '90%',              
              flexDirection: 'row',
              justifyContent: 'space-between',
              zIndex: 1,
            }}>
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
                zIndex: 4,
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
          <ScrollView pointerEvents="box-none" bounces={false}
           showsVerticalScrollIndicator={false}>
            {/* logo home */}
            <View style={{alignSelf: 'center'}}>
              <Image source={require('../../assets/logo_waitinglist.png')} />
            </View>
            <TouchableOpacity
              style={{alignSelf: 'center', marginTop: 10}}
              onPress={() => navigation.navigate('Home', {})}>
              <Text style={{color: 'white'}}>Clique : QR SCANN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{alignSelf: 'center', marginTop: 10}}
              onPress={() => navigation.navigate('Enigma', {})}>
              <Text style={{color: 'white'}}>Clique : Enigma</Text>
            </TouchableOpacity>
            <View style={{marginTop: 45}}>
              <TextGradient
                style={{
                  fontFamily: globalStyles.bold.fontFamily,
                  fontSize: 28,
                  textAlign: 'center',
                  color: colors.white,
                }}>
                LISTE D'ATTENTE
              </TextGradient>
              <Text
                style={{
                  fontFamily: globalStyles.medium.fontFamily,
                  fontSize: 18,
                  width: 300,
                  textAlign: 'center',
                  marginTop: 20,
                  color: colors.white,
                }}>
                Pour assurer des gains interessants à tous nos joueurs, le
                nombre d’utilisateur est limité
              </Text>
            </View>
            {/* File d'attente */}
            <View
              style={{
                backgroundColor: colors.backgroundColor,
                height: 179,
                width: 231,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                marginTop: 29,
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontFamily: globalStyles.medium.fontFamily,
                  fontSize: 24,
                  width: 300,
                  textAlign: 'center',
                  color: colors.white,
                }}>
                Position :
              </Text>
              {/* number */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TextGradient
                  style={{
                    fontFamily: globalStyles.medium.fontFamily,
                    fontSize: 44,
                    textAlign: 'center',
                    color: colors.white,
                  }}>
                  {user?.waiting_list?.current_position}
                </TextGradient>
                <TextGradient
                  style={{
                    fontFamily: globalStyles.medium.fontFamily,
                    fontSize: 28,
                    textAlign: 'center',
                    color: colors.white,
                  }}>
                  ème
                </TextGradient>
              </View>
              {/* Separator */}
              <View
                style={{
                  height: 1,
                  width: '55%',
                  marginTop: 7,
                  backgroundColor: colors.white,
                }}
              />
              {/* Total waiting */}
              <View style={{marginTop: 9}}>
                <Text
                  style={{
                    fontFamily: globalStyles.medium.fontFamily,
                    fontSize: 25,
                    width: 300,
                    textAlign: 'center',
                    color: colors.white,
                  }}>
                  {user?.waiting_list?.total_in_waiting}
                </Text>
              </View>
            </View>
            {/* Description */}
            <View style={{marginTop: 33}}>
              <Text
                style={{
                  fontFamily: globalStyles.light.fontFamily,
                  fontSize: 18,
                  width: 307,
                  textAlign: 'center',
                  color: colors.white,
                }}>
                Vous serez notifié lorsque les fonctionnalités{' '}
                <Text
                  style={{
                    color: '#FFD94D',
                    fontFamily: globalStyles.medium.fontFamily,
                    fontSize: 18,
                  }}>
                  QR Scan
                </Text>{' '}
                et
                <Text
                  style={{
                    color: '#FFD94D',
                    fontFamily: globalStyles.medium.fontFamily,
                    fontSize: 18,
                  }}>
                  Wallet
                </Text>{' '}
                seront disponibles pour vous
              </Text>
            </View>
            <View style={{height: 90}} />
          </ScrollView>
        </SafeAreaView>
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
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#000000',
    opacity: 0.6,
  },
  walletText: {
    color: '#FFF',
    fontFamily: globalStyles.light.fontFamily,
    fontSize: 16,
    marginLeft: 8,
  },
});
