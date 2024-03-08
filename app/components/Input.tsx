import moment from 'moment';
import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {HelperText, TextInput} from 'react-native-paper';
import {CheckboxText} from './CheckBoxText';
import PhoneInput from 'react-native-phone-number-input';
import {useFormContext} from 'react-hook-form';
import {RadioButton} from 'react-native-paper';
import {PhoneNumberUtil} from 'google-libphonenumber';
import {useTheme} from '../../contexts/ThemeContext';
import {globalStyles} from '../GlobalStyle';
import {PickerCustom} from './PickerCustom';
import DatePickerComponent from '../components/DatePickerComponent';

export const Input = ({
  error,
  id,
  field,
  inputRef,
  onEndEditing,
  onBlurPhone,
  ...textInputProps
}) => {
  const isError = Boolean(error);
  const {colors, theme} = useTheme();
  const [chosenDate, setChosenDate] = React.useState(textInputProps.value);
  const [emailAlreadyExist, setEmailAlreadyExist] = React.useState(null);
  const [proCodeExist, setProCodeExist] = React.useState(null);
  //    const {API, signIn} = useAPI()
  const [showSecureTextEntry, setShowSecureTextEntry] = React.useState(
    textInputProps.secureTextEntry,
  );
  const {register} = useFormContext();
  /* const mutationEmailExist = useMutation(
    API.emailExists,
    {
      onSuccess: data => {
        if (data.data.success) {
          setEmailAlreadyExist(data.data.already_exist ? 'Y' : 'N');
        }
      },
    },
    {enabled: textInputProps.verified},
  ); */

  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const styles = StyleSheet.create({
    field: {
      marginTop: globalStyles.margin,
    },
  });
  const phoneInput = React.useRef();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  React.useEffect(() => {
    let type = textInputProps.type || '';

    if (type === 'date') {
      textInputProps.onChangeText(chosenDate);
    }
  }, [chosenDate]);

  const handleConfirm = date => {
    var d = moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
    setChosenDate(d);
    hideDatePicker();
  };

  const checkPhone = e => {
    textInputProps.onChangeText({
      format: e,
      number: phoneInput?.current?.getCallingCode(),
    });
  };

  const phoneUtil = PhoneNumberUtil.getInstance();

  const defaultVal = textInputProps?.value;

  const region = React.useMemo(() => {
    let type = textInputProps.type || '';
    if (type === 'phone') {
      try {
        const parsedNumber = phoneUtil?.parse(textInputProps?.value);
        let countryCode = parsedNumber?.getCountryCode();
        let regionCode = phoneUtil?.getRegionCodeForCountryCode(countryCode);
        let f = defaultVal?.replace(`+${countryCode}`, '');
        field.value = f;

        return regionCode;
      } catch {}
    }
  }, [textInputProps]);

  return (
    <View style={[styles.field, textInputProps.styleInput]}>
      {textInputProps?.placeholderHead && (
        <Text
          style={[
            globalStyles.medium,
            {
              fontSize: 16,
              lineHeight: 19,
              letterSpacing: 0.5,
              fontWeight: '300',
              color: colors.white,
              fontFamily: globalStyles.light.fontFamily,
            },
          ]}>
          {textInputProps.placeholderHead}
        </Text>
      )}
      {(() => {
        let type = textInputProps.type || '';
        switch (type) {
          case 'radioGroup':
            return (
              <RadioButton.Group
                {...textInputProps}
                onValueChange={e => {
                  textInputProps.onChangeText(e);
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  {textInputProps.choices.map((e, i) => {
                    return (
                      <View
                        key={i}
                        style={{
                          marginRight: globalStyles.margin,
                          alignItems: 'center',
                          flexDirection: 'row',
                        }}>
                        <RadioButton.Android
                          value={e}
                          color={colors.btnBg}
                          uncheckedColor={colors.gray400}
                        />
                        <Text
                          style={[globalStyles.medium, {color: colors.black}]}>
                          {e}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </RadioButton.Group>
            );
          case 'checkbox':
            return (
              <CheckboxText
                {...textInputProps}
                callback={e => {
                  textInputProps.onChangeText(e);
                }}
              />
            );
          case 'phone':
            return (
              <View
                style={{
                  backgroundColor: 'transparent',
                  marginTop: 8,
                  height: 56,
                  overflow: 'visible',
                }}>
                <View
                  style={{
                    //borderWidth: 2,
                    /* borderColor: isError
                      ? colors.red
                      : focused
                      ? colors.btnBg2
                      : 'transparent', */

                    overflow: 'hidden',
                    borderRadius: 8,
                  }}>
                  <PhoneInput
                    {...register(id, {
                      validate: value => {
                        return (
                          value.length < 1 ||
                          phoneInput?.current?.isValidNumber(
                            value?.format || value,
                          ) ||
                          'Mauvais format téléphone'
                        );
                      },
                    })}
                    {...textInputProps}
                    textInputProps={{
                      ...field,
                      placeholderTextColor: colors.backgroundColor,
                      selectionColor: colors.backgroundColor,
                      color: '#FFFFFF',
                      height: 56,
                      onFocus: () => {  
                        setFocused(true);
                      },
                      onBlur: () => {
                        if(onBlurPhone){
                          onBlurPhone(phoneInput?.current);
                        }
                        setFocused(false);
                      },
                      onEndEditing: () => {
                        onEndEditing(phoneInput?.current);
                      },
                    }}
                    placeholder="Téléphone"
                    countryPickerProps={{
                      translation: 'fra',
                      filterProps: {
                        placeholder: "Choisir l'indicatif",
                      },
                    }}
                    layout="first"
                    disableArrowIcon={true}
                    flagButtonStyle={{
                      borderColor: '#FFF',
                    }}
                    containerStyle={{
                      paddingVertical: 0,
                      width: '100%',
                      backgroundColor: colors.backgroundColor,
                      borderWidth: 1,
                      borderColor: colors.backgroundColor,
                      borderRadius: 8,
                      height: 56,
                    }}
                    defaultCode={region || 'RE'}
                    defaultValue={textInputProps.value}
                    ref={phoneInput}
                    textContainerStyle={{
                      backgroundColor: 'transparent',
                      //opacity: 0.7,
                      borderTopRightRadius: 8,
                      borderBottomRightRadius: 8,
                      overflow: 'visible',
                    }}
                    codeTextStyle={{
                      color: colors.placeholder,
                      fontFamily: globalStyles.medium.fontFamily,
                      fontSize: 16,
                      lineHeight: 19,
                      fontWeight: '500',
                    }}
                    onChangeFormattedText={checkPhone}
                  />
                </View>
              </View>
            );
          case 'picker':
            return <PickerCustom {...textInputProps} />;
          case 'date':
            return (
              <DatePickerComponent isError={isError} {...textInputProps} />
            );
          case 'time':
            return (
              <TouchableOpacity onPress={showDatePicker}>
                <View>
                  <View pointerEvents={'none'}>
                    <TextInput
                      scrollEnabled={false}
                      {...textInputProps}
                      outlineColor={colors.grayLight}
                      error={isError}
                      style={[
                        textInputProps.style,
                        {
                          backgroundColor: colors.backgroundColor,
                        },
                      ]}
                      placeholderTextColor={colors.gray400}
                      theme={textInputProps.theme || theme}
                      mode="outlined"
                    />
                  </View>

                  <DateTimePicker
                    is24Hour={true}
                    date={
                      textInputProps.value
                        ? moment(textInputProps.value, 'HH:mm')?.toDate() ||
                          new Date()
                        : new Date()
                    }
                    headerTextIOS={"Date d'anniversaire"}
                    confirmTextIOS={'Selectionner'}
                    cancelTextIOS={'Fermer'}
                    mode="time"
                    isVisible={isDatePickerVisible}
                    onConfirm={date => {
                      var d = moment(date).format('HH:mm');
                      textInputProps.onChangeText(d);
                      hideDatePicker();
                    }}
                    onCancel={hideDatePicker}
                  />
                </View>
              </TouchableOpacity>
            );
          default:
            return (
              <TextInput
                scrollEnabled={false}
                ref={inputRef}
                outlineColor={colors.grayLight}
                onFocus={() => {
                  setEmailAlreadyExist(null);
                  setProCodeExist(null);
                }}
                onBlur={() => {
                  if (textInputProps.verified) {
                    if (
                      textInputProps.value.match(
                        /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      )
                    ) {
                      /* mutationEmailExist.mutate({
                        email: textInputProps.value,
                      }); */
                    }
                  }
                }}
                /* left={
                  textInputProps?.left ||
                  ((id === 'email' ||
                    id === 'password' ||
                    id === 'confirm') && (
                    <TextInput.Icon
                      size={20}
                      pointerEvents={'box-none'}
                      color={colors.gray400}
                      name={
                        id === 'email'
                          ? require('../assets/email.png')
                          : require('../assets/password.png')
                      }
                    />
                  ))
                } */
                placeholderTextColor={colors.gray400}
                {...textInputProps}
                error={isError}
                right={
                  textInputProps.right ||
                  ((textInputProps.verified && emailAlreadyExist === 'N') ||
                  (textInputProps.verifiedProCode && proCodeExist === 'Y') ? (
                    <TextInput.Icon
                      forceTextInputFocus={false}
                      size={20}
                      color={colors.green}
                      name={'check'}
                    />
                  ) : (
                    textInputProps.secureTextEntry &&
                    !textInputProps.noIcon && (
                      <TextInput.Icon
                        forceTextInputFocus={false}
                        size={20}
                        color={colors.backgroundColor}
                        onPress={() => {
                          setShowSecureTextEntry(!showSecureTextEntry);
                        }}
                        name={showSecureTextEntry ? 'eye' : 'eye-off'}
                      />
                    )
                  ))
                }
                style={[
                  {
                    backgroundColor: colors.backgroundColor,
                  },
                ]}
                secureTextEntry={showSecureTextEntry}
                theme={textInputProps.theme || theme}
                mode="outlined"
              />
            );
        }
      })()}
      {textInputProps.infoText ? (
        <HelperText
          type="info"
          theme={{colors: {text: colors.red}}}
          style={{fontSize: 15, color: colors.red}}
          visible={true}>
          {textInputProps.infoText}
        </HelperText>
      ) : (
        <View style={{height: 0}} />
      )}
      {textInputProps.verifiedProCode && proCodeExist === 'N' ? (
        <HelperText
          type="info"
          theme={{colors: {text: colors.red}}}
          style={{fontSize: 15, color: colors.red}}
          visible={true}>
          {'Code inconnu'}
        </HelperText>
      ) : (
        <View style={{height: 0}} />
      )}
      {isError && (
        <HelperText
          style={{fontSize: 15, fontFamily: globalStyles.medium.fontFamily}}
          type="error"
          visible={isError}>
          {error}
        </HelperText>
      )}
    </View>
  );
};
