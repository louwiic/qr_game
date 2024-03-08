import {useLazyQuery, useMutation} from '@apollo/client';
import React, {createRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Keyboard,
} from 'react-native';
import {ActivityIndicator, Avatar, TextInput} from 'react-native-paper';
import {useAlert} from '../../../contexts/AlertContext';
import {BaseURL, useAPI} from '../../../contexts/ApiContext';
import {useTheme} from '../../../contexts/ThemeContext';
import {useContextUser} from '../../../contexts/UserContext';
import BackgroundGradient from '../../components/BackgrounGradient';
import ItemMenuGradient from '../../components/partials/ItemMenuGradient';
import {Loader} from '../../components/partials/Loader';
import ActionSheetComponent from '../../components/ActionSheetComponent';
import {navigate} from '../../navigations/MainStack';
import {globalStyles} from '../../GlobalStyle';
import GradientText from '../../components/TextGradient';
import {FormProvider, useForm} from 'react-hook-form';
import {FormInput} from '../../components/FormInput';
import ButtonGradient from '../../components/partials/ButtonGradient';
import AvatarComponent from '../../components/AvatarComponent';

const ItemAccount = ({text, icon, onClick}) => {
  const {colors} = useTheme();

  return <ItemMenuGradient text={text} icon={icon} onPress={onClick} />;
};

export const Account = ({navigation}) => {
  const {signOut, API} = useAPI();
  const {colors} = useTheme();
  const [user, setUser] = useState(null);
  const {alert, close} = useAlert();
  const formMethods = useForm({
    defaultValues: {
      firstname: user?.firstname,
      lastname: user?.lastname,
    },
  });
  const actionOfferSheetRef = createRef();
  const [dismissSheet, setDismissSheet] = useState(false);
  const [errorIban, setErrorIban] = useState('');

  const [currentUser, {data, error, loading}] = useLazyQuery(API.USER_PROFIL);
  const [testIban, {data: checkIban}] = useLazyQuery(API.CHECK_IBAN, {
    onCompleted: data => {
      if (data?.ibanIsValid) {
        setErrorIban(false);
      } else {
        setErrorIban(true);
      }
    },
    onError: error => console.log('ERROR ', error),
  });
  const [updateUserRib, {loading: loading_update_rib}] = useMutation(
    API.EDIT_RIB,
    {
      onCompleted: data => {
        console.log('Update rib data', data);
        if (data?.updateUserRib) {
          Alert.alert('Informations', 'Votre rib a été mis à jour');
          setDismissSheet(true);
        }
        /* if (data?.login) {
        const {login: loginSuccess} = data;
        console.log(data);
        if (loginSuccess?.access && loginSuccess?.refresh) {
          await signIn({
            access_token: loginSuccess?.access,
            refresh_token: loginSuccess?.refresh,
          });
          navigation.reset({
            index: 0,
            routes: [{name: 'TabStack'}],
          });
        }
      } */
      },
    },
  );

  const onSubmit = form => {
    Keyboard.dismiss();
    const d = {
      firstname: String(form?.firstname),
      lastname: String(form?.lastname),
      iban: String(form?.iban),
      bic: String(form?.bic),
    };

    updateUserRib({variables: d});

    //mutation({variables: form});
    //navigation.navigate('NewPassword');
  };
  const MENU = [
    {
      id: 'edit',
      icon: require('../../assets/weel.png'),
      onClick: () => {
        navigate('EditAccount');
      },
      text: 'Editer mon compte',
    },
    {
      id: 'editpwd',
      icon: require('../../assets/Lock.png'),
      onClick: () => {
        navigate('EditAccount');
      },
      text: 'Changer mon mot de passe',
    },
    {
      id: 'edit',
      icon: require('../../assets/rib.png'),
      onClick: () => {
        console.log('edit rib');
        handleSheetEditRib();
      },
      text: 'Ajouter / modifier mon rib',
    },
    {
      id: 'edit',
      icon: require('../../assets/share.png'),
      onClick: () => {
        navigate('EditAccount');
      },
      text: "Partager l'application",
    },
    {
      id: 'logout',
      icon: 'logout',
      onClick: () => {
        Alert.alert(
          'Confirmation',
          'Êtes-vous sûr de vouloir vous déconnecter?',
          [
            {
              text: 'Oui, se déconnecter',
              onPress: async () => {
                signOut();
                navigation.reset({
                  index: 0,
                  routes: [{name: 'AuthStack'}],
                });
              },
            },
            {text: 'Annuler'},
          ],
        );
      },
      text: 'Déconnecter',
    },
  ];

  React.useEffect(() => {
    if (dismissSheet) {
      actionOfferSheetRef?.current?.hide();
    }
  }, [dismissSheet]);

  React.useEffect(() => {
    currentUser();
  }, []);

  React.useEffect(() => {
    if (data) {
      setUser(data?.currentUser);
      formMethods.reset(
        {
          firstname: data?.currentUser.firstname,
          lastname: data?.currentUser.lastname,
          iban: data?.currentUser.iban,
          bic: data?.currentUser.bic,
        },
        {},
      );
    }
  }, [data]);

  React.useEffect(() => {
    if (loading) {
      alert(<Loader title={' '} />);
    } else {
      close();
    }
  }, [loading]);

  const NameUser = () => {
    return (
      <Text
        style={[
          globalStyles.medium,
          {
            flex: 1,
            marginTop: 16,
            fontSize: 20,
            letterSpacing: 0.48,
            lineHeight: 24,
            color: user?.is_premium ? '#FFD94D' : colors.white,
          },
        ]}>
        {user?.nickname
          ? user?.nickname.charAt(0).toUpperCase() +
            user?.nickname.slice(1).toLowerCase() +
            '/'
          : ''}
        {`${
          user?.firstname.charAt(0).toUpperCase() +
            user?.firstname.slice(1).toLowerCase() || ''
        } ${
          user?.lastname.charAt(0).toUpperCase() +
            user?.lastname.slice(1).toLowerCase() || ''
        }`}
      </Text>
    );
  };

  const dim = Dimensions.get('window');
  const ListHeaderComponent = ({navigation}) => (
    <View>
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
        <View
          style={{
            height: 100,
            width: 90,
            backgroundColor: 'transparent',
          }}
        />
        {user?.is_premium ? (
          <Image
            style={{marginRight: 20}}
            source={require('../../assets/premiumIcon.png')}
          />
        ) : (
          <Image
            style={{marginRight: 20}}
            source={require('../../assets/icon_freemium.png')}
          />
        )}
      </View>
      {/* Avatar */}
      <View style={{marginBottom: 23}}>
        <TouchableOpacity
          disabled={true}
          onPress={() => {
            //handleAvatar()
          }}
          style={{alignItems: 'center', justifyContent: 'center'}}>
          {loading}
          {user?.is_premium ? (
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

          <AvatarComponent
            size={90}
            style={{position: 'absolute'}}
            source={{uri: BaseURL + user?.avatar}}
          />
        </TouchableOpacity>
        <View style={{alignItems: 'center'}}>
          <NameUser />
          <Text
            style={{
              color: colors.white,
              fontFamily: globalStyles.light.fontFamily,
              fontSize: 16,
            }}>
            {user?.email}
          </Text>
          <Text
            style={{
              color: colors.white,
              fontFamily: globalStyles.light.fontFamily,
              fontSize: 16,
            }}>
            {user?.phone}
          </Text>
        </View>
      </View>
    </View>
  );

  const handleSheetEditRib = () => {
    actionOfferSheetRef?.current?.show();
  };

  const onErrors = errors => {
    console.warn('errors', errors);
  };

  return (
    <BackgroundGradient>
      <SafeAreaView style={{flex: 1, padding: globalStyles.margin_large}}>
        <FlatList
          data={MENU}
          extraData={user}
          ListHeaderComponent={<ListHeaderComponent navigation={navigation} />}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            return <ItemAccount {...item} />;
          }}
          ListFooterComponent={() => {
            return (
              <View style={{marginTop: '15%', alignItems: 'center'}}>
                <Image
                  style={{}}
                  source={require('../../assets/bandeauQR.png')}
                />
                <View style={{flexDirection: 'row', marginTop: 18}}>
                  <Text
                    style={{
                      color: colors.white,
                      fontFamily: globalStyles.medium.fontFamily,
                      fontSize: 11,
                    }}>
                    Conditions Generales d'utilisation
                  </Text>
                  <Text
                    style={{
                      color: colors.white,
                      fontFamily: globalStyles.medium.fontFamily,
                      fontSize: 11,
                      marginLeft: 11,
                    }}>
                    Politique de confidentialité
                  </Text>
                </View>
                <Text
                  style={{
                    color: colors.black,
                    fontFamily: globalStyles.medium.fontFamily,
                    fontSize: 11,
                    marginTop: 17,
                  }}>
                  Supprimer mon compte
                </Text>
              </View>
            );
          }}
        />
        {/* Bottom sheet */}
        <ActionSheetComponent actionOfferSheetRef={actionOfferSheetRef}>
          {/* <BackgroundGradient style={{backgroundColor: 'transparent'}}> */}
          <View
            style={{
              // height: 500,
              marginTop: 50,
              width: '100%',
            }}>
            <GradientText
              style={{
                fontSize: 22,
                fontFamily: globalStyles.medium.fontFamily,
              }}>
              Editer mon RIB
            </GradientText>
            <View style={{width: 322, marginTop: 22}}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#FFF',
                  fontFamily: globalStyles.light.fontFamily,
                }}>
                Ajouter ou modifier mon RIB pour pouvoir effectuer une demande
                de virement
              </Text>
            </View>
            <View>
              <FormProvider {...formMethods}>
                <View style={{flexDirection: 'row'}}>
                  <FormInput
                    outlineColor={colors.backgroundColor}
                    control={formMethods.control}
                    styleInput={[{flex: 1, marginRight: 8}]}
                    rules={{required: 'Prénom est obligatoire'}}
                    name={'firstname'}
                    placeholder={user?.firstname ? user?.firstname : 'Prenom'}
                    placeholderHead={' '}
                  />
                  <FormInput
                    outlineColor={colors.backgroundColor}
                    control={formMethods.control}
                    name={'lastname'}
                    placeholder={user?.lastname ? user?.lastname : 'Prenom'}
                    placeholderHead={' '}
                    rules={{required: 'Nom est obligatoire'}}
                    styleInput={[{flex: 1, marginLeft: 8}]}
                  />
                </View>

                <FormInput
                  outlineColor={colors.backgroundColor}
                  control={formMethods.control}
                  name={'iban'}
                  autoCapitalize="none"
                  rules={{
                    required: "Le RIB est obligatoire",
                    /* pattern: {
                      value: /^FR\d{12}[A-Z0-9]{11}\d{2}$/,
                      message: 'Veuillez saisir un IBAN valide',
                    }, */
                  }}
                  infoText={errorIban ? 'Veuillez saisir un RIB valide' : ''}
                  onBlur={e => {
                    let {text} = e.nativeEvent;
                    testIban({variables: {test_iban: text}});
                    /* if (text) {
                    emailExist({variables: {email: text}});
                  } else {
                    setCheckEmail(false);
                  } */
                  }}
                  placeholder={user?.iban ? user?.iban : 'IBAN'}
                />
                <FormInput
                  outlineColor={colors.backgroundColor}
                  control={formMethods.control}
                  name={'bic'}
                  autoCapitalize="none"
                  rules={{
                    required: 'Le code BIC est obligatoire',
                  }}
                  placeholder={user?.bic ? user?.bic : 'BIC'}
                />
              </FormProvider>

              {/* <View>
                  <Image
                    width={310}
                    height={56}
                    source={require('../../assets/gradientBtn.png')}
                  />
                  </View> */}

              <ButtonGradient
                onPress={formMethods.handleSubmit(onSubmit, onErrors)}
                marginTop={40}
                text={'Valider'}
              />
              <View style={{height: 145}} />
            </View>
          </View>
          {/*  </BackgroundGradient> */}
        </ActionSheetComponent>
      </SafeAreaView>
    </BackgroundGradient>
  );
};
