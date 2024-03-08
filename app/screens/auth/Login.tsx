import {useMutation} from '@apollo/client';
import React, { useState } from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {
  Dimensions,
  Image,
  Keyboard,
  SafeAreaView,
  View,
  Text,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useAPI} from '../../../contexts/ApiContext';
import {FormInput} from '../../components/FormInput';
import {ViewWithLoading} from '../../components/ViewWithLoading';
import {globalStyles} from '../../GlobalStyle';
import {navigate} from '../../navigations/MainStack';
import BackgroundGradient from '../../components/BackgrounGradient';
import TextGradient from '../../components/TextGradient';
import {useTheme} from '../../../contexts/ThemeContext';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ButtonGradient from '../../components/partials/ButtonGradient';
import { useAlert } from '../../../contexts/AlertContext';
import { Loader } from '../../components/partials/Loader';

const dim = Dimensions.get('window');
const LOGIN_FIELDS = {
  email: 'email',
  password: 'password',
};

export const Login = ({navigation, route}) => {
  const formMethods = useForm({
    defaultValues: {
      email: route?.params?.email,
    },
  });
  const {signIn, API} = useAPI();
  const {colors} = useTheme();
  const {alert, close} = useAlert();
  const [errorCredentials,setErrorCredentials] = useState(null)
  const [login, {error,loading}] = useMutation(API.LOGIN, {
    onCompleted: async data => {
      console.log("Data", data)
      if (data?.login) {
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
      }
    },
  });



  React.useEffect(() => {    
    if(!error){
      if (loading) {
        alert(<Loader title={'Connexion en cours'}/>);
      } else {
        close();
      }
    }
  }, [error,loading]);

  React.useEffect(() =>{
    if(error){
      console.log(error)
      close();

      [
        {
          type: "manual",
          name: LOGIN_FIELDS.email,
          message: " "
        },
        {
          type: "manual",
          name: LOGIN_FIELDS.password,
          message: "E-mail ou mot de passe incorrect"
        }
      ].forEach(({ name, type, message }) =>
      formMethods.setError(name, { type, message },{shouldFocusError:true})
      );

    }
  },[error])

  const onSubmit = form => {
    setErrorCredentials(false)
    Keyboard.dismiss();
    login({variables: form});
  };

  const onErrors = errors => {
    console.warn('errors', errors);
  };

  return (
    <BackgroundGradient>
        {/* logo */}
        <SafeAreaView>
          <View style={{marginTop: '3%', height: dim.height / 6}}>
            <Image
              style={{alignSelf: 'center', marginTop: 10}}
              source={require('../../assets/logoAuth.png')}
            />
          </View>
        </SafeAreaView>
        <KeyboardAwareScrollView
          pointerEvents="box-none"
          bounces={false}
          keyboardShouldPersistTaps={'handled'}
          keyboardDismissMode={'interactive'}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={{margin: globalStyles.margin_large}}>
            {/* Title */}
            <View
              style={{
                flexDirection: 'row',
                marginTop: '9%',
              }}>
              <Text
                style={{
                  color: '#FFF',
                  fontFamily: globalStyles.medium.fontFamily,
                  fontSize: 22,
                }}>
                Bienvenue sur{' '}
              </Text>
              <TextGradient
                style={{
                  fontSize: 22,
                  fontFamily: globalStyles.ethnocentric.fontFamily,
                }}>
                QR WIN !
              </TextGradient>
            </View>
            <FormProvider {...formMethods}>
              <FormInput
                outlineColor={colors.backgroundColor}
                name={LOGIN_FIELDS.email}
                //placeholderHead={'Email'}
                onFocus={() => {
                  formMethods.clearErrors(LOGIN_FIELDS.email)
                  formMethods.clearErrors(LOGIN_FIELDS.password)
                }}
                placeholder={'Adresse email'}
                autoCapitalize="none"
                returnKeyType="next"
                keyboardType="email-address"
                rules={{
                  required: <Text>Adresse email obligatoire</Text>,
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Mauvais format email',
                  },
                }}
              />
              <FormInput
                name={LOGIN_FIELDS.password}
                outlineColor={colors.backgroundColor}
                //placeholderHead={'Mot de passe'}
                placeholder={'Mot de passe'}
                secureTextEntry={true}
                onFocus={() => {
                  formMethods.clearErrors(LOGIN_FIELDS.email)
                  formMethods.clearErrors(LOGIN_FIELDS.password)
                }}
                rules={{
                  minLength: {
                    value: 4,
                    message:
                      'Le mot de passe doit comporter plus de 3 caractères',
                  },
                  required: 'Mot de passe obligatoire',
                }}
              />
            </FormProvider>
            <TouchableOpacity
              onPress={() => {
                navigate('LostPassword');
              }}
              activeOpacity={0.7}
              style={{
                marginVertical: globalStyles.margin,
                alignSelf: 'flex-end',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <TextGradient
                style={{
                  fontSize: 14,
                  fontFamily: globalStyles.medium.fontFamily,
                }}>
                Mot de passe
              </TextGradient>
              <Text style={{color: '#FFF', fontSize: 14}}> oublié ?</Text>
            </TouchableOpacity>
            {/* <Button
                uppercase={false}
                onPress={() => {
                  navigate('LostPassword');
                }}
                style={{
                  marginVertical: globalStyles.margin,
                  alignSelf: 'flex-end',
                }}
                mode="text">
                oublié ?
              </Button> */}

            <ButtonGradient
              onPress={formMethods.handleSubmit(onSubmit, onErrors)}
              buttonStyles
              marginTop={globalStyles.margin}
              text={'Se connecter'}
            />

            {/* <Button
                //disabled={true}
                style={{
                  marginTop: globalStyles.margin,
                }}
                onPress={formMethods.handleSubmit(onSubmit, onErrors)}
                contentStyle={{
                  height: 56,
                  letterSpacing: 0.5,
                }}
                uppercase={false}
                labelStyle={[globalStyles.medium, {color: '#FFF'}]}
                mode="contained">
                Connexion
              </Button> */}
          </View>
        </KeyboardAwareScrollView>
        {/* Text bottom */}
        <View
          style={{
            position: 'absolute',
            bottom: 54,
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <Text
            style={{
              color: '#FFF',
              fontFamily: globalStyles.medium.fontFamily,
              fontSize: 16,
            }}>
            Vous n'avez pas encore de compte ?
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Signup');
            }}>
            <TextGradient
              style={{
                fontSize: 16,
                fontFamily: globalStyles.medium.fontFamily,
              }}>
              Inscrivez-vous
            </TextGradient>
          </TouchableOpacity>
        </View>
    </BackgroundGradient>
  );
};
