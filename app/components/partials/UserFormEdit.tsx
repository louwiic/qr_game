import {useLazyQuery} from '@apollo/client';
import moment from 'moment';
import React from 'react';
import {FormProvider} from 'react-hook-form';
import {Text, View} from 'react-native';
import {useAPI} from '../../../contexts/ApiContext';
import {useTheme} from '../../../contexts/ThemeContext';
import {globalStyles} from '../../GlobalStyle';
import {FormInput} from '../FormInput';
import GradientText from '../TextGradient';

export const UserFormEdit = ({currentUser, editMode, formMethods}) => {
  const {colors} = useTheme();
  const {API} = useAPI();
  const [checkNickname, setCheckNickname] = React.useState(false);
  const [checkEmail, setCheckEmail] = React.useState(false);
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
    if (dataPhone) {
      setCheckEmail(dataPhone.existPhone);
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
            name={SIGNUP_FIELDS.firstname}
            placeholder={'Prenom'}
            placeholderHead={'Information'}
          />
          <FormInput
            outlineColor={colors.backgroundColor}
            control={formMethods.control}
            name={SIGNUP_FIELDS.lastname}
            placeholder={'Nom'}
            placeholderHead={' '}
            rules={{required: 'Nom est obligatoire'}}
            styleInput={[{flex: 1, marginLeft: 8}]}
          />
        </View>
        {/* Pseudo */}
        <FormInput
          disabled
          outlineColor={colors.backgroundColor}
          control={formMethods.control}
          name={SIGNUP_FIELDS.nickname}
          placeholder={currentUser?.nickname ? currentUser?.nickname : 'Pseudo'}
          //placeholderHead={'Pseudo'}
          infoText={checkNickname ? 'Pseudo déjà utilisé' : ''}
          onEndEditing={e => {
            let {text} = e.nativeEvent;
            if (text) {
              existNickname({variables: {nickname: text}});
            } else {
              setCheckNickname(false);
            }
          }}
          styleInput={{marginTop: 8}}
          autoCapitalize="none"
          placeholderTextColor={'#FFFFFF20'}
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
            /* placeholder={
              currentUser?.birthday
                ? moment(currentUser?.birthday).format('DD/MM/YYYY')
                : ''
            } */
          />

          <FormInput
            outlineColor={colors.backgroundColor}
            control={formMethods.control}
            name={SIGNUP_FIELDS.gender}
            type={'picker'}
            styleInput={[{width: '48%'}]}
            data={[
              {value: 'MALE', name: 'Monsieur'},
              {value: 'FEMALE', name: 'Madame'},
              {value: 'OTHER', name: 'Autre'},
            ]}
            placeholder={'Civilité'}
          />
        </View>
        {/* Phone */}
        <FormInput
          type={'phone'}
          keyboardType="phone-pad"
          control={formMethods.control}
          name={SIGNUP_FIELDS.phone}
          placeholder={currentUser?.phone ? currentUser?.phone : 'Telephone'}
          onEndEditing={e => {
            //let {text} = e.nativeEvent;
            //   console.log(e?.value?.format);
            /* if (text) {
              emailExist({variables: {email: text}});
            } else {
              setCheckEmail(false);
            } */
          }}
        />
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
                  value: /[A-Za-z]+[0-9]{1}/,
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
      </FormProvider>
    </View>
  );
};
