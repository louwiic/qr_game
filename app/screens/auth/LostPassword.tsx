import {useMutation} from '@apollo/client';
import React from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {
  Dimensions,
  ScrollView,
  View,
  SafeAreaView,
  Text,
  Image,
  Alert,
  Keyboard,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useAPI} from '../../../contexts/ApiContext';
import {useTheme} from '../../../contexts/ThemeContext';
import BackgroundGradient from '../../components/BackgrounGradient';
import {FormInput} from '../../components/FormInput';
import ButtonGradient from '../../components/partials/ButtonGradient';
import GradientText from '../../components/TextGradient';
import {ViewWithLoading} from '../../components/ViewWithLoading';
import {globalStyles} from '../../GlobalStyle';
import {navigate} from '../../navigations/MainStack';

const dim = Dimensions.get('window');
export const LostPassword = ({navigation}) => {
  const {API} = useAPI();
  const formMethods = useForm();
  const {colors} = useTheme();

  const [mutation, {error, loading}] = useMutation(API.LOST_PASSWORD, {
    onCompleted: data => {
      if (data?.lostPassword) {
        navigate('NewPassword', formMethods.getValues());
        //analytics().logEvent('AskNewPassword', {});
        Alert.alert(
          'Email envoyé',
          'Un code a été envoyé à cette adresse email',
        );
      }
    },
  });

  React.useEffect(() => {
    if (error) {
      console.log(error);

      formMethods.setError('email', {
        type: 'manual',
        message: 'L’e-mail que vous avez saisi n’est pas associé à un compte',
      },{shouldFocusError:true});

    }
  }, [error]);

  const onSubmit = form => {
    Keyboard.dismiss();
    mutation({variables: form});
    //navigation.navigate('NewPassword');
  };

  const onErrors = errors => {
    console.warn('errors', errors);
  };

  return (
    <BackgroundGradient>
      <ViewWithLoading
        isLoading={false}
        style={{margin: globalStyles.margin_large, flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <SafeAreaView>
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
          </SafeAreaView>

          {/* Title */}
          <View>
            <GradientText
              style={{
                fontSize: 22,
                fontFamily: globalStyles.medium.fontFamily,
              }}>
              Mot de passe oubliez
            </GradientText>
            <View style={{width: 322, marginTop: 22}}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#FFF',
                  fontFamily: globalStyles.light.fontFamily,
                }}>
                Confirmez votre adresse email, nous vous enverrons le code pour
                réinitialiser votre mot de passe
              </Text>
            </View>
          </View>
          <View>
            <FormProvider {...formMethods}>
              <FormInput
                outlineColor={colors.backgroundColor}
                name={'email'}
                keyboardType="email-address"
                autoCapitalize="none"
                rules={{
                  required:
                    "L'e-mail est obligatoire",
                }}
                placeholder={'Adresse email'}
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
              buttonStyles
              marginTop={globalStyles.margin_large}
              text={'Envoyer'}
            />
          </View>
        </ScrollView>
      </ViewWithLoading>
    </BackgroundGradient>
  );
};
