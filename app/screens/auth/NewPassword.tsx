import {useLazyQuery, useMutation} from '@apollo/client';
import React from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {Alert, Dimensions, Image, SafeAreaView, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ActivityIndicator} from 'react-native-paper';
import {useAPI} from '../../../contexts/ApiContext';
import {useTheme} from '../../../contexts/ThemeContext';
import BackgroundGradient from '../../components/BackgrounGradient';
import {FormInput} from '../../components/FormInput';
import InputVerifCode from '../../components/InputVerifCode';
import ButtonGradient from '../../components/partials/ButtonGradient';
import GradientText from '../../components/TextGradient';
import {ViewWithLoading} from '../../components/ViewWithLoading';
import {globalStyles} from '../../GlobalStyle';
const PASSWORD_FIELDS = {
  reset_code: 'reset_code',
  password: 'password',
};
const dim = Dimensions.get('window');

export const NewPassword = ({navigation, route}) => {
  const {API} = useAPI();
  const formMethods = useForm();
  const params = route.params;
  const {colors} = useTheme();
  const [codes, setCodes] = React.useState(null);
  const [loadVerif, setLoadVerif] = React.useState(false);
  const [errorVerifCode, setErrorVerifCode] = React.useState(false)

  const [recreatePassword, {error,loading}] = useMutation(API.NEW_PASSWORD, {
    onCompleted: d => {
      if(d?.recreatePassword){
        Alert.alert(
          'Changement de mot de passe',
          'Votre mot de passe a bien été changé, veuillez vous connecter',
        );
        navigation.reset({
          index: 1,
          routes: [
            {name: 'Login'},
            {
              name: 'Login',
              params: {
                email: params.email,
              },
            },
          ],
        });
      }      
    },
  });

  React.useEffect(() => {
    if (error) {
      setErrorVerifCode(true)
      console.log('Error', error);

    }
  }, [error]);

  const onSubmit = form => {
    const obj = {
      email: params.email,
      resetCode: `${codes.code1}${codes.code2}${codes.code3}${codes.code4}`,
      confirm: form.password,
      password: form.password,
    };

    recreatePassword({variables: obj});
  };

  const onErrors = errors => {
    console.warn('errors', errors);
  };

  return (
    <BackgroundGradient>
      <SafeAreaView>
        <ViewWithLoading
          style={{flexGrow: 1}}
          isLoading={false}
          textLoading={'Chargement en cours...'}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{height: '100%'}}>
            <View style={{margin: globalStyles.margin_large}}>
              {/* logo */}
              <View
                style={{
                  marginTop: '4%',
                  height: dim.height / 6,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  activeOpacity={0.4}
                  onPress={() => navigation.goBack()}
                  style={{width: 90}}>
                  <Image source={require('../../assets/back.png')} />
                </TouchableOpacity>
                <View style={{width: 90}}>
                  <Image
                    style={{alignSelf: 'center'}}
                    source={require('../../assets/logo_signup.png')}
                  />
                </View>
                <View
                  style={{
                    height: 100,
                    width: 90,
                    backgroundColor: 'transparent',
                  }}
                />
              </View>

              {/* Title */}
              <View>
                <GradientText
                  style={{
                    fontSize: 22,
                    fontFamily: globalStyles.medium.fontFamily,
                  }}>
                  Vérification
                </GradientText>
                <View style={{width: 320, height: 57, marginTop: 22}}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#FFF',
                      fontFamily: globalStyles.light.fontFamily,
                    }}>
                    Saisissez le code qui vous a été envoyé par e-mail
                  </Text>
                </View>
              </View>
              <FormProvider {...formMethods}>
                {/* <FormInput
                outlineColor={colors.backgroundColor}
                name={PASSWORD_FIELDS.reset_code}
                rules={{required: 'Le champ est obligatoire'}}
                placeholderHead={'Code de validation'}
                placeholder={'Ex : 12839'}
              /> */}
                {console.log("errorVerifCode",errorVerifCode)}
                {/* Code de vérification */}
                <InputVerifCode
                  errorVerifCode={errorVerifCode}
                  setErrorVerifCode={setErrorVerifCode}
                  callback={codes => {
                    console.log(codes);
                    setCodes(codes);
                  }}
                />
                {loadVerif && (
                  <ActivityIndicator
                    size={'small'}
                    color="#FFF"
                    style={{
                      marginTop: 17,
                      alignSelf: 'flex-start',
                    }}
                  />
                )}
                {/* PAssword */}
                <FormInput
                  outlineColor={colors.backgroundColor}
                  control={formMethods.control}
                  name={PASSWORD_FIELDS.password}
                  styleInput={{marginTop: 10}}
                  style={{marginTo: null}}
                  rules={{
                    required:
                      '6 caractères minimum dont au moins 1 lettre et 1 chiffre',
                    minLength: {
                      value: 6,
                      message:
                        '6 caractères minimum dont au moins 1 lettre et 1 chiffre',
                    },
                    pattern: {
                      value:
                        /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~A-Za-z]+[0-9]{1}/,
                      message:
                        '6 caractères minimum dont au moins 1 lettre et 1 chiffre',
                    },
                  }}
                  placeholderHead={'Nouveau mot de passe'}
                  placeholder={'Mot de passe'}
                  secureTextEntry={true}
                />
                {/* password */}
                <FormInput
                  outlineColor={colors.backgroundColor}
                  control={formMethods.control}
                  name={PASSWORD_FIELDS.password}
                  styleInput={{marginTop: 8}}
                  style={{marginTo: null}}
                  rules={{
                    required:
                      '6 caractères minimum dont au moins 1 lettre et 1 chiffre',
                    minLength: {
                      value: 6,
                      message:
                        '6 caractères minimum dont au moins 1 lettre et 1 chiffre',
                    },
                    pattern: {
                      value:
                        /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~A-Za-z]+[0-9]{1}/,
                      message:
                        '6 caractères minimum dont au moins 1 lettre et 1 chiffre',
                    },
                  }}
                  placeholderHead={null}
                  placeholder={'Mot de passe (confirmation)'}
                  secureTextEntry={true}
                />
              </FormProvider>

              <ButtonGradient
                text="Valider"
                onPress={formMethods.handleSubmit(onSubmit, onErrors)}
                marginTop={globalStyles.extra_margin}
              />
            </View>
          </KeyboardAwareScrollView>
        </ViewWithLoading>
      </SafeAreaView>
    </BackgroundGradient>
  );
};