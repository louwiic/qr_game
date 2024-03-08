import React from 'react';
import {useController, useFormContext} from 'react-hook-form';
import {Keyboard, View} from 'react-native';
import {HelperText, TextInput} from 'react-native-paper';
import {useTheme} from '../../contexts/ThemeContext';

const InputVerifCode = ({callback,errorVerifCode,setErrorVerifCode}) => {
  const {colors} = useTheme();
  var textInputRefs = React.useRef([]);
  const [next, setNext] = React.useState(null);
  const [codes, setCodes] = React.useState({
    code1: null,
    code2: null,
    code3: null,
    code4: null,
  });

  const {
    control,
    formState: {errors},
  } = useFormContext();

  React.useEffect(() => {
    if (codes.code1 && codes.code2 && codes.code3 && codes.code4) {
      //setCodeError(false);
      callback(codes);
    }
  }, [codes]);

  return (
    <>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        {/* 1 */}
        <TextInput
          scrollEnabled={false}
          ref={input => {
            textInputRefs.current[0] = input;
          }}
          outlineColor={colors.backgroundColor}
          keyboardType="number-pad"
          onFocus={() => {
            textInputRefs.current[0].clear();
            setCodes({...codes, code1: null});
            setErrorVerifCode(false)
          }}
          onChangeText={num => {
            if (Number(num) >= 0 && num !== '' && textInputRefs.current[0]) {
              textInputRefs.current[1].focus();
              setCodes({...codes, code1: Number(num)});
            }
          }}
          //placeholderTextColor={colors.gray400}
          //error={isError}
          style={[
            {
              //backgroundColor: colors.backgroundColor,
              width: 56,
              textAlign: 'center',
            },
          ]}
          //secureTextEntry={showSecureTextEntry}
          //theme={textInputProps.theme || theme}
          mode="outlined"
          maxLength={1}
          returnKeyType={'next'}
        />
        {/* 2 */}
        <TextInput
          scrollEnabled={false}
          ref={input => {
            textInputRefs.current[1] = input;
          }}
          outlineColor={colors.backgroundColor}
          keyboardType="number-pad"
          onFocus={() => {
            textInputRefs.current[1].clear();
            setCodes({...codes, code2: null});
            setErrorVerifCode(false)
          }}
          onChangeText={num => {
            if (Number(num) >= 0 && num !== '' && textInputRefs.current[1]) {
              textInputRefs.current[2].focus();
              setCodes({...codes, code2: Number(num)});
            }
          }}
          //placeholderTextColor={colors.gray400}
          //error={isError}
          style={[
            {
              //backgroundColor: colors.backgroundColor,
              width: 56,
              textAlign: 'center',
            },
          ]}
          //secureTextEntry={showSecureTextEntry}
          //theme={textInputProps.theme || theme}
          mode="outlined"
          maxLength={1}
          returnKeyType={'next'}
        />
        {/* 3 */}
        <TextInput
          scrollEnabled={false}
          ref={input => {
            textInputRefs.current[2] = input;
          }}
          outlineColor={colors.backgroundColor}
          keyboardType="number-pad"
          onFocus={() => {
            textInputRefs.current[2].clear();
            setCodes({...codes, code3: null});
            setErrorVerifCode(false)
          }}
          onChangeText={num => {
            if (Number(num) >= 0 && num !== '' && textInputRefs.current[2]) {
              textInputRefs.current[3].focus();
              setCodes({...codes, code3: null});
              setCodes({...codes, code3: Number(num)});
            }
          }}
          //placeholderTextColor={colors.gray400}
          //error={isError}
          style={[
            {
              //backgroundColor: colors.backgroundColor,
              width: 56,
              textAlign: 'center',
            },
          ]}
          //secureTextEntry={showSecureTextEntry}
          //theme={textInputProps.theme || theme}
          mode="outlined"
          maxLength={1}
          //returnKeyType={returnKey}
        />
        {/* 4*/}
        <TextInput
          scrollEnabled={false}
          ref={input => {
            textInputRefs.current[3] = input;
          }}
          outlineColor={colors.backgroundColor}
          keyboardType="number-pad"
          onFocus={() => {
            textInputRefs.current[3].clear();
            setCodes({...codes, code4: null});
            setErrorVerifCode(false)
          }}
          onChangeText={num => {
            if (Number(num) >= 0 && num !== '' && textInputRefs.current[3]) {
              setCodes({...codes, code4: Number(num)});
              Keyboard.dismiss();
            }
          }}
          //placeholderTextColor={colors.gray400}
          //error={isError}
          style={[
            {
              //backgroundColor: colors.backgroundColor,
              width: 56,
              textAlign: 'center',
            },
          ]}
          //secureTextEntry={showSecureTextEntry}
          //theme={textInputProps.theme || theme}
          mode="outlined"
          maxLength={1}
          onEndEditing={event => {
            Keyboard.dismiss();
            callback(codes);
          }}
          returnKeyType={'done'}
        />
      </View>
      {errorVerifCode ? (
        <HelperText
          type="info"
          theme={{colors: {text: colors.red}}}
          style={{
            fontSize: 15,
            color: colors.red,
            width: '90%',
            marginLeft: -10,
            marginTop: 8,
          }}
          visible={true}>
          {/* {textInputProps.infoText} */}
          Code de validation incorrect
        </HelperText>
      ) : (
        <View style={{height: 0}} />
      )}
    </>
  );
};
export default InputVerifCode;
