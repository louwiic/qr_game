import {useLazyQuery} from '@apollo/client';
import {isNullableType} from 'graphql';
import React from 'react';
import {FormProvider} from 'react-hook-form';
import {Text, View} from 'react-native';
import {useAPI} from '../../../contexts/ApiContext';
import {useTheme} from '../../../contexts/ThemeContext';
import {globalStyles} from '../../GlobalStyle';
import {FormInput} from '../FormInput';
import GradientText from '../TextGradient';

export const UserForm = ({editMode, formMethods}) => {
  const {colors} = useTheme();
  const {API} = useAPI();
  const [checkNickname, setCheckNickname] = React.useState(false);
  const [checkEmail, setCheckEmail] = React.useState(false);
  const [checkPhone, setCheckPhone] = React.useState(false);
  const SIGNUP_FIELDS = editMode
    ? {
        lastname: 'lastname',
        firstname: 'firstname',
        nickname: 'nickname',
        phone: 'phone',
        email: 'email',
        birthday: 'birthday',
        gender: 'gender',
        password: 'password',
        confirm_password: 'confirm_password',
        cgu: 'cgu',
      }
    : {
        lastname: 'lastname',
        firstname: 'firstname',
        nickname: 'nickname',
        phone: 'phone',
        email: 'email',
        birthday: 'birthday',
        gender: 'gender',
        password: 'password',
        confirm_password: 'confirm_password',
        cgu: 'cgu',
      };

  const [existNickname, {data: dataNick}] = useLazyQuery(
    API.EXIST_USER_NICKNAME,
  );
  const [emailExist, {data: dataEmail}] = useLazyQuery(API.EXIST_USER);
  const [existPhone, {data: dataPhone}] = useLazyQuery(API.EXIST_PHONE_USER);

  React.useEffect(() => {
    if (dataNick) {
      setCheckNickname(dataNick.existNickname);
    }
  }, [dataNick]);

  React.useEffect(() => {
    if (dataEmail) {
      setCheckEmail(dataEmail.existUser);
    }
  }, [dataEmail]);

  React.useEffect(() => {
    if (dataPhone && dataPhone?.existPhone) {
      setCheckPhone(true);
      //formMethods.setError(SIGNUP_FIELDS.phone, { type:'manual', message:"Téléphone déjà attribrué à un autre compte" },{shouldFocusError:true})
    } else {
      setCheckPhone(false);
    }
  }, [dataPhone]);

  return (
    <View>
      <FormProvider {...formMethods}>
        <View style={{flexDirection: 'row'}}>
          <FormInput
            outlineColor={colors.backgroundColor}
            control={formMethods.control}
            styleInput={[{flex: 1, marginRight: 8}]}
            rules={{required: 'Prénom est obligatoire'}}
            name={SIGNUP_FIELDS.lastname}
            placeholder={'Prenom'}
            placeholderHead={'Information'}
          />
          <FormInput
            outlineColor={colors.backgroundColor}
            control={formMethods.control}
            name={SIGNUP_FIELDS.firstname}
            placeholder={'Nom'}
            placeholderHead={' '}
            rules={{required: 'Nom est obligatoire'}}
            styleInput={[{flex: 1, marginLeft: 8}]}
          />
        </View>

        {!editMode && (
          <FormInput
            outlineColor={colors.backgroundColor}
            control={formMethods.control}
            name={SIGNUP_FIELDS.nickname}
            verified
            placeholder={'Pseudo'}
            //placeholderHead={'Pseudo'}
            infoText={checkNickname ? 'Pseudo déjà utilisé' : ''}
            /* onEndEditing={e => {
              let {text} = e.nativeEvent;
              if (text) {
                existNickname({variables: {nickname: text}});
              } else {
                setCheckNickname(false);
              }
            }} */
            onBlur={e => {
              let {text} = e.nativeEvent;
              console.log("email",text);
              
              if (text) {
                existNickname({variables: {nickname: text}});
              }
            }}
            styleInput={{marginTop: 8}}
            autoCapitalize="none"
            rules={{required: 'Pseudo est obligatoire'}}
          />
        )}

        {/* Phone */}
        <FormInput
          type={'phone'}
          keyboardType="phone-pad"
          placeholder={'Telephone'}
          control={formMethods.control}
          name={SIGNUP_FIELDS.phone}
          placeholderHead={'Contact'}
          infoText={
            checkPhone ? 'Téléphone déjà attribrué à un autre compte' : ''
          }
          onBlurPhone={e => {
            if (e?.props?.defaultValue?.format) {
              existPhone({variables: {phone: e?.props?.defaultValue?.format}});
            }
          }}

          onEndEditing={e => {}}
        />

        {/* email */}
        <FormInput
          outlineColor={colors.backgroundColor}
          control={formMethods.control}
          name={SIGNUP_FIELDS.email}
          verified
          placeholder={'Email'}
          infoText={checkEmail ? 'Cette adresse e-mail existe déjà' : ''}
          onBlur={e => {
            let {text} = e.nativeEvent;
            console.log("email",text);
            
            if (text) {
              emailExist({variables: {email: text}});
            }
          }}
          /* onEndEditing={e => {
              let {text} = e.nativeEvent;
              log("text",text)
              if (text) {
                emailExist({variables: {email: text}});
              } else {
                setCheckEmail(false);
              }
            }} */
          styleInput={{marginTop: 8}}
          autoCapitalize="none"
          keyboardType="email-address"
          rules={{
            required: 'Adresse email est obligatoire',
            pattern: {
              value:
                /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: 'E-mail invalide',
            },
          }}
        />

        {/* birthday && gender */}
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
          <FormInput
            outlineColor={colors.backgroundColor}
            type={'date'}
            placeholder={'DD/MM/YYYY'}
            rules={{}}
            control={formMethods.control}
            styleInput={[{width: '48%'}]}
            name={SIGNUP_FIELDS.birthday}
            //placeholderHead={'Date de naissance'}
          />

          <FormInput
            outlineColor={colors.backgroundColor}
            control={formMethods.control}
            name={SIGNUP_FIELDS.gender}
            type={'picker'}
            //styleInput={[{width: 90%'}]}
            styleInput={[
              {
                width: '48%',
              },
            ]}
            data={[
              {value: 'MALE', name: 'Monsieur'},
              {value: 'FEMALE', name: 'Madame'},
              {value: 'OTHER', name: 'Autre'},
            ]}
            placeholder={'Civilité'}
          />
        </View>
        {/* MDP */}
        {!editMode && (
          <View>
            <FormInput
              outlineColor={colors.backgroundColor}
              control={formMethods.control}
              name={SIGNUP_FIELDS.password}
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
              placeholderHead={'Mot de passe'}
              placeholder={'Mot de passe'}
              secureTextEntry={true}
            />
          </View>
        )}
        {!editMode && (
          <View>
            <FormInput
              outlineColor={colors.backgroundColor}
              control={formMethods.control}
              name={SIGNUP_FIELDS.confirm_password}
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
                  value: /[A-Za-z]+[0-9]{1}/,
                  message:
                    '6 caractères minimum dont au moins 1 lettre et 1 chiffre',
                },
              }}
              //placeholderHead={'Mot de passe'}
              placeholder={'Mot de passe (confirmation)'}
              secureTextEntry={true}
            />
          </View>
        )}
        {!editMode && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 27,
              marginBottom: 10,
            }}>
            <FormInput
              control={formMethods.control}
              styleInput={[
                {marginRight: 8, marginTop: null, marginBottom: null},
              ]}
              rules={{
                required:
                  'Veuillez accepter les conditions générales pour finaliser votre inscription',
              }}
              name={SIGNUP_FIELDS.cgu}
              choices={['']}
              type={'checkbox'}
              onChangeText={val => {
                console.log('CheckBox', val);
              }}
              color={colors.green}
              placeholderHead={null}
              placeholder={
                <View
                  style={{
                    flexDirection: 'row',
                    width: '90%',
                  }}>
                  <Text
                    style={{
                      color: '#FFF',
                      fontFamily: globalStyles.medium.fontFamily,
                      fontSize: 16,
                    }}>
                    J'accepte{' '}
                  </Text>
                  <GradientText
                    style={{
                      fontFamily: globalStyles.medium.fontFamily,
                      fontSize: 16,
                    }}>
                    Les Conditions Générales
                  </GradientText>
                </View>
              }
            />
          </View>
        )}
      </FormProvider>
    </View>
  );
};
