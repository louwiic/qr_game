import {
  useMutation,
  useLazyQuery,
  useQuery,
  useApolloClient,
} from '@apollo/client';
import moment from 'moment';
import React, {useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {Alert, Dimensions, Image, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ActivityIndicator, Avatar, Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useQueryClient} from 'react-query';
import {useAlert} from '../../../contexts/AlertContext';
import {BaseURL, useAPI} from '../../../contexts/ApiContext';
import {useTheme} from '../../../contexts/ThemeContext';
import {useContextUser} from '../../../contexts/UserContext';
import BackgroundGradient from '../../components/BackgrounGradient';
import {FormInput} from '../../components/FormInput';
import ButtonGradient from '../../components/partials/ButtonGradient';
import {Loader} from '../../components/partials/Loader';
import {UserFormEdit} from '../../components/partials/UserFormEdit';
import {ViewWithLoading} from '../../components/ViewWithLoading';
import {globalStyles} from '../../GlobalStyle';
import {useMedia} from '../../hooks/useMedia';
const dim = Dimensions.get('window');
import {ReactNativeFile} from 'apollo-upload-client';
import ModalInfos from '../../components/ModalInfos';
import {ImageRemote} from '../../components/ImageRemote';
import EgnimaAnswer from '../../components/EgnimaAnswer';

export const Enigma = ({navigation, route}) => {
  const {colors} = useTheme();
  const {alert, close} = useAlert();
  const [user, setUser] = useState(null);
  const client = useApolloClient();
  const {takePhotoOrGallery} = useMedia();
  const [avatarFile, setAvatarFile] = useState(null);
  const [enigmas, setEnigmas] = React.useState([]);
  const {barreCode} = route.params || {};
  const [fakeLoading, setFakeLoading] = React.useState(false);
  const formMethods = useForm({
    defaultValues: {},
  });
  const {API} = useAPI();

  const [currentUser, {data, error, loading}] = useLazyQuery(
    API.USER_EDIT_PROFIL,
  );
  const [storeScan, {data: data_enigma, error: err_storescann, loading: ld}] =
    useLazyQuery(API.ENIGMAS_ANSWERS);

  React.useEffect(() => {
    if (barreCode) {
      storeScan({variables: {id: barreCode}});
      setFakeLoading(true);
      setTimeout(() => {
        setFakeLoading(false);
      }, 2800);
    } else {
      storeScan({variables: {id: '01b70b82-06a9-45db-aa34-5ce314d0c7ce'}});
    }
  }, [barreCode]);

  React.useEffect(() => {
    if (data_enigma) {
      /* console.log(
        'Enigam',
        JSON.stringify(
          JSON.parse(data_enigma?.storeScan?.enigmas?.enigmas[0]?.answers),
          null,
          2,
        ),
      ); */
      setEnigmas(data_enigma?.storeScan);
    }
  }, [data_enigma]);

  React.useLayoutEffect(() => {
    currentUser();
  }, []);

  if (fakeLoading) {
    return (
      <BackgroundGradient>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image source={require('../../assets/logo_waitinglist.png')} />
          <View style={{marginTop: 10}}>
            <Text style={{fontSize: 16, color: '#FFF'}}>Lancement du jeu</Text>
            <ActivityIndicator style={{marginTop: 10}} color={'#FFF'} />
          </View>
        </View>
      </BackgroundGradient>
    );
  }

  const onErrors = errors => {
    console.warn('errors', errors);
  };

  const Header = () => {
    return (
      <SafeAreaView>
        <View
          style={{
            marginTop: '3%',
            height: dim.height / 14,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            activeOpacity={0.4}
            onPress={() => {
              if (route?.params?.resumeScann) {
                route?.params?.resumeScann();
              }
              navigation.goBack();
              /*  navigation.reset({
                index: 0,
                routes: [{name: 'TabStack'}],
              }); */
            }}
            style={{width: 90}}>
            <Image
              style={{marginLeft: 20}}
              source={require('../../assets/back.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity disabled={true} activeOpacity={0.4}>
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: globalStyles.medium.fontFamily,
                  color: colors.white,
                }}>
                Jusqu'à
              </Text>
              <View style={{flexDirection: 'row', marginLeft: 5}}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: globalStyles.ethnocentric.fontFamily,
                    color: colors.white,
                  }}>
                  {enigmas?.enigmas?.qr_coins}
                </Text>
                <Image source={require('../../assets/coin.png')} />
              </View>
              <Text
                style={{
                  fontSize: 10,
                  marginTop: -5,
                  fontFamily: globalStyles.medium.fontFamily,
                  color: colors.white,
                }}>
                à gagner
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* Avatar */}
        <View style={{}}>
          <TouchableOpacity
            disabled={true}            
            style={{alignItems: 'center', justifyContent: 'center'}}>
            { enigmas?.enigmas?.enigmas.filter(e => e?.is_star === true)?.length > 0 ? (
              <Image
                style={{}}
                source={true && require('../../assets/avatarAccountGold.png')}
              />
            ) : (
              <Image
                style={{}}
                source={true && require('../../assets/avatarAccountWhite.png')}
              />
            )}
            <View style={{position: 'absolute'}}>
              <Avatar.Image
                size={90}
                style={{height: 90, width: 90}}
                /* source={{
                    uri: avatarFile
                      ? BaseURL + avatarFile
                      : BaseURL + user?.avatar,   }} */
                source={require('../../assets/entreprise.png')}
              />
            </View>
          </TouchableOpacity>
          {/* Title entreprise */}
          <View style={{alignItems: 'center', marginTop: 15}}>
            <Text
              style={{
                color: '#FFF',
                fontFamily: globalStyles.medium.fontFamily,
                fontSize: 16,
              }}>
              {enigmas?.name}
            </Text>
            <Text
              style={{
                color: '#FFF',
                fontFamily: globalStyles.light.fontFamily,
                fontSize: 14,
              }}>
              {enigmas?.category?.name}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  };
  return (
    <BackgroundGradient>
      {/*  <ModalInfos /> */}
      <ViewWithLoading
        styleContaine={{flex: 1}}
        style={{flex: 1}}
        textLoading={'Chargement ...'}
        isLoading={loading}>
        <View
          style={{
            margin: globalStyles.margin_large,
            flex: 1,
            //marginBottom: 200,
          }}>
          <Header />
          <EgnimaAnswer barreCode={barreCode} />
        </View>
      </ViewWithLoading>
    </BackgroundGradient>
  );
};
