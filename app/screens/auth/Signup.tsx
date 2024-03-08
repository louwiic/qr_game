import React, {useCallback, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useAPI} from '../../../contexts/ApiContext';
import BackgroundGradient from '../../components/BackgrounGradient';
import {UserForm} from '../../components/partials/UserForm';
import {ViewWithLoading} from '../../components/ViewWithLoading';
import {globalStyles} from '../../GlobalStyle';
import TextGradient from '../../components/TextGradient';
import ButtonGradient from '../../components/partials/ButtonGradient';
import {useLazyQuery, useMutation} from '@apollo/client';
import moment from 'moment';
import { useAlert } from '../../../contexts/AlertContext';
import { Loader } from '../../components/partials/Loader';

const dim = Dimensions.get('window');
export const Signup = ({navigation, route}) => {
  const formMethods = useForm({
    defaultValues: {
      email: '',
      lastname: '',
      firstname: '',
      nickname: '',
      phone: '',
      birthday: '',
      gender: '',
      password: '',
      confirm_password: '',
    },
  });
  const {API, signIn} = useAPI();
  const [phone, setPhone] = useState(null)
  const [existPhone, {data: dataPhone}] = useLazyQuery(API.EXIST_PHONE_USER);
  const {alert, close} = useAlert();

  const [createUser, {loading}] = useMutation(API.REGISTER, {
    onCompleted: async data => {
      if (data?.register) {
        const {register: registerSuccess} = data;
        console.log(data);
        if (registerSuccess?.access && registerSuccess?.refresh) {
         navigation.navigate('VerifyPhone',{phone, access:registerSuccess?.access ,refresh: registerSuccess?.refresh})
        }
      }
    },
  });

  const onSubmit = useCallback(
    form => {
      const {
        birthday,
        confirm_password,
        email,
        firstname,
        gender,
        lastname,
        nickname,
        password,
        phone,
      } = form;

      const d = {
        lastname,
        firstname,
        nickname,
        phone: phone.format,
        email,
        birthday: moment(birthday).format('YYYY-MM-DD'),
        gender: gender,
        password,
        confirm_password,
      };

      //return console.log(JSON.stringify(form, null, 2));
      setPhone(d.phone)
      if (d.password !== d.confirm_password) {
        return Alert.alert(
          'Attention',
          'Les deux mot de passe doivent être identiques',
        );
      }

      /*  if (dataPhone) {
        return Alert.alert(
          'Attention',
          'Téléphone déjà attribué à un autre compte',
        );
      } */

      Keyboard.dismiss();
      createUser({variables: d});
    },
    [dataPhone],
  );

  React.useEffect(() => {    
    if (loading) {
      alert(<Loader title={'Création de votre compte ...'}/>);
    } else {
      close();
    }
  }, [loading]);

  const onErrors = errors => {
    console.warn('errors', errors?.phone);
  };

  return (
    <BackgroundGradient>
      <SafeAreaView>            
          <KeyboardAwareScrollView >
            {/* logo */}
            <View
              style={{
                marginTop: '3%',
                height: dim.height / 6,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                activeOpacity={0.4}
                onPress={() => navigation.goBack()}
                style={{width: 90,}}>
                <Image style={{marginLeft:20}} source={require('../../assets/back.png')} />
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
            <View style={{marginHorizontal: globalStyles.margin_large}}>
              {/* Title */}
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <TextGradient
                  style={{
                    fontSize: 22,
                    fontFamily: globalStyles.medium.fontFamily,
                  }}>
                  Créer un compte
                </TextGradient>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("VerifyPhone")}>
                <Text style={{color:"#FFF"}}>Simulate créate compte</Text>
              </TouchableOpacity>
              <UserForm editMode={false} formMethods={formMethods} />

              <ButtonGradient
                onPress={formMethods.handleSubmit(onSubmit, onErrors)}
                marginTop={globalStyles.margin}
                text={'Créer un compte'}
              />
            </View>
          </KeyboardAwareScrollView>
      </SafeAreaView>
    </BackgroundGradient>
  );
};
