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

export const EditAccount = ({navigation}) => {
  const {colors} = useTheme();
  const {alert, close} = useAlert();
  const [user, setUser] = useState(null);
  const client = useApolloClient();
  const {takePhotoOrGallery} = useMedia();
  const [avatarFile, setAvatarFile] = useState(null);
  const formMethods = useForm({
    defaultValues: {
      ...user,
      firstname: user?.firstname,
      lastname: user?.lastname,
      //birthday: '1993-09-11',
    },
  });
  const formMethods2 = useForm();
  const {API} = useAPI();

  /**
   * Upload File
   */
  const [singleUpload, {loading: loading_upload}] = useMutation(
    API.SINGLE_UPLOAD,
    {
      onError: err => {
        console.log('error', err);
      },
      onCompleted: async data => {
        const {singleUpload: uploadSuccess} = data;
        console.log('data', data);
        setAvatarFile(data?.singleUpload?.url);
      },
    },
  );
  const [currentUser, {data, error, loading}] = useLazyQuery(
    API.USER_EDIT_PROFIL,
  );

  /**
   * Update info user
   */
  const [updateInfo, {loading: loading_update}] = useMutation(API.UPDATE_USER, {
    onCompleted: data => {
      console.log('UPDATED', data);
      if (data?.updateUserProfile) {
        Alert.alert('Informations', 'Vos informations ont bien été mis à jour');
        setTimeout(() => {
          navigation.goBack();
          client.refetchQueries({include: [API.USER_PROFIL]});
        }, 400);
      } else {
        Alert.alert('Erreur', 'Une erreur est survenu');
      }
    },
  });

  /**
   * Update Email user
   */
  const [updateUserEmail, {loading: loading_update_email}] = useMutation(
    API.UPDATE_EMAIL_USER,
    {
      onCompleted: data => {
        if (data?.updateUserEmail) {
          Alert.alert(
            'Informations',
            'Votre adresse email a bien été mis à jour',
          );
          setTimeout(() => {
            navigation.goBack();
            client.refetchQueries({include: [API.USER_PROFIL]});
          }, 400);
        }
      },
      onError: error => {
        console.log('Error', error);
      },
    },
  );

  React.useLayoutEffect(() => {
    currentUser();
  }, []);

  React.useLayoutEffect(() => {
    if (data) {
      setUser(data?.currentUser);
      console.log(JSON?.stringify(data?.currentUser, null, 2));
      formMethods.reset(
        {
          firstname: data?.currentUser.firstname,
          lastname: data?.currentUser.lastname,
          nickname: data?.currentUser.nickname,
          gender: data?.currentUser.gender,
          phone: data?.currentUser?.phone,
          birthday: data?.currentUser?.birthday,
        },
        {},
      );
      formMethods2.reset(
        {
          email: data?.currentUser?.email,
        },
        {},
      );
    }
  }, [data]);

  /**
   *  Submit form infos user
   * @param form
   */
  const onSubmitInfos = form => {
    const {firstname, lastname, phone, birthday, gender, avatar} = form;

    const d = {
      lastname: lastname ? lastname : user?.lastname,
      firstname: firstname ? firstname : user?.firstname,
      phone: phone.format ? phone.format : user?.phone,
      birthday: moment(birthday).format('YYYY-MM-DD'),
      gender: gender,
      avatar: avatarFile ? avatarFile : user?.avatar,
    };

    console.log('form', JSON.stringify(d, null, 2));

    /* if(avatar){
      d.push({avatar: avatarFile})
    } */

    updateInfo({variables: d});
  };

  /**
   * Submit form email user
   * @param form
   * @returns
   */
  const onSubmitEmail = form => {
    console.log('form', form);
    updateUserEmail({variables: form});
  };

  /*  React.useEffect(() => {
    if (loading_update) {
      alert(<Loader title={' '} />);
    } else {
      close();
    }
  }, [loading_update]); */

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
            onPress={() => navigation.goBack()}
            style={{width: 90}}>
            <Image
              style={{marginLeft: 20}}
              source={require('../../assets/back.png')}
            />
          </TouchableOpacity>
        </View>
        {/* Avatar */}
        <View style={{}}>
          {loading_upload ? (
            <ActivityIndicator size={24} color={colors.white} />
          ) : (
            <TouchableOpacity
              onPress={() => {
                takePhotoOrGallery(photo => {
                  if (photo && photo.uri) {
                    const file = new ReactNativeFile({
                      uri: photo.uri,
                      name: new Date().getTime() + '.png',
                      type: 'image/png',
                    });
                    singleUpload({
                      variables: {
                        file: file,
                      },
                    });
                  }
                });
              }}
              style={{alignItems: 'center', justifyContent: 'center'}}>
              {user?.is_premium ? (
                <Image
                  style={{}}
                  source={true && require('../../assets/avatarAccountGold.png')}
                />
              ) : (
                <Image
                  style={{}}
                  source={
                    true && require('../../assets/avatarAccountWhite.png')
                  }
                />
              )}
              <View style={{position: 'absolute'}}>
                <Avatar.Image
                  size={90}
                  style={{}}
                  source={{
                    uri: avatarFile
                      ? BaseURL + avatarFile
                      : BaseURL + user?.avatar,
                  }}
                />
                <Image
                  style={{position: 'absolute', right: -10, bottom: 0}}
                  source={true && require('../../assets/edit_avatar.png')}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  };
  return (
    <BackgroundGradient>
      {/*  <ModalInfos /> */}
      <ViewWithLoading textLoading={'Chargement ...'} isLoading={loading}>
        <KeyboardAwareScrollView
          keyboardDismissMode={'interactive'}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{height: '100%'}}>
          <View style={{margin: globalStyles.margin_large}}>
            <Header />
            <UserFormEdit
              editMode
              formMethods={formMethods}
              currentUser={user}
            />
            <ButtonGradient
              onPress={formMethods.handleSubmit(onSubmitInfos, onErrors)}
              marginTop={30}
              text={'Mettre à jour mes informations'}
            />
          </View>

          {/* Email update */}
          <View>
            <FormProvider {...formMethods2}>
              <FormInput
                outlineColor={colors.backgroundColor}
                name={'email'}
                autoCapitalize="none"
                styleInput={[{width: '90%', alignSelf: 'center'}]}
                rules={{
                  required: 'Adresse email est obligatoire',
                  pattern: {
                    value:
                      /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'E-mail invalide',
                  },
                }}
                /* infoText={errorIban ? 'Veuillez saisir un RIB valide' : ''}
                  onBlur={e => {
                    let {text} = e.nativeEvent;
                   testIban({variables: {test_iban: text}});
                  }} */
                placeholder={'Email'}
              />
              <View style={{width: '90%', alignSelf: 'center'}}>
                <ButtonGradient
                  onPress={formMethods2.handleSubmit(onSubmitEmail, onErrors)}
                  marginTop={30}
                  text={'Mettre à jour mon email'}
                />
              </View>
              <View style={{height: 50}} />
            </FormProvider>
          </View>
        </KeyboardAwareScrollView>
      </ViewWithLoading>
    </BackgroundGradient>
  );
};
