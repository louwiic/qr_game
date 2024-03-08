import {Picker} from '@react-native-picker/picker';
import React from 'react';
import {Platform, TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {useTheme} from '../../contexts/ThemeContext';
import {BottomSheetAction} from './bottomSheet';

export const PickerCustom = props => {
  const {colors} = useTheme();
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
      props.onChangeText(props?.data?.[0]?.value);
    
  }, []);

  React.useEffect(() => {
    let i = props?.data?.findIndex(e => {
      return e.value === props.value;
    });
    if (i > -1) {
      setIndex(i);
    }
  }, [props.data, props.value]);

  React.useEffect(() => {
    if (Platform.OS === 'ios') {
      if (index === 0 && props.setValue) {
        props.setValue(props?.data?.[0]?.value);
        props.onChangeText(props?.data?.[0]?.value);
      }
    }
  }, [props.data, index]);

  const theme = {
    roundness: 10,
    isDark: false,
    colors: {
      primary: colors.cardColor,
      text: colors.cardColor,
      backgroundColor: '#FFFFFF08',
      placeholder: '#FFFFFF08',
    },
  };

  return Platform.OS === 'ios' ? (
    <View style={props.containerStyle}>
      <TouchableOpacity
        disabled={props.disabled}
        onPress={() =>
          BottomSheetAction(
            props?.data?.map((e, index) => {
              return {
                title: e.name,
                callback: () => {
                  setIndex(index);
                  props.onChangeText(e.value);
                  props.setValue(e.value);
                },
              };
            }),
          )
        }>
        <TextInput
          pointerEvents="none"
          mode={props?.mode || 'outlined'}
          //placeholderTextColor={'rgba(255,255,255,0.4)'}
          {...props}
          //value={props.value ? props.value : props?.data?.[index]?.name || ''}
          value={props?.data?.[index]?.name || props.value || ''}
          label={props.hint || ''}
          onSubmitEditing={() => {
            next(department.ref);
          }}
          editable={false}
          style={[
            props.style,
            {
              zIndex: 1,
              backgroundColor: colors.backgroundColor,
              width: '100%',
            },
            //props.styleInput,

          ]}
          right={
            <TextInput.Icon
            onPress={() =>
              BottomSheetAction(
                props?.data?.map((e, index) => {
                  return {
                    title: e.name,
                    callback: () => {
                      setIndex(index);
                      props.onChangeText(e.value);
                      props.setValue(e.value);
                    },
                  };
                }),
              )
            }
              forceTextInputFocus={false}
              size={24}
              color={props.iconColor || colors.backgroundColor}
              name={props.iconName || "chevron-down"}
            />
          }
          //theme={theme}
          returnKeyType="next"
        ></TextInput>
      </TouchableOpacity>
    </View>
  ) : (
    <View
      style={[
        props.containerStyle,
        {
          height: 65,
          overflow: 'hidden',
          width: '100%',
          alignItems: 'center',
        },
      ]}>
      <Picker
        //ref={props.setRef}
        mode={'dropdown'}
        style={{
          position: 'absolute',
          top: 0,
          height: 65,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9,
          color: 'transparent',
        }}
        dropdownIconColor={'white'}
        selectedValue={props.value}
        onValueChange={(itemValue, itemIndex) => {
          props.onChangeText(itemValue);
          setIndex(itemIndex);
        }}>
        {props?.data?.map(item => {
          return (
            <Picker.Item
              key={item.value}
              label={item.name}
              value={item.value}
            />
          );
        })}
      </Picker>
      <TextInput
        //theme={theme}
        mode="outlined"
        onSubmitEditing={() => {
          next(department.ref);
        }}
        //placeholderTextColor={'rgba(255,255,255,0.4)'}
        {...props}
        value={(props?.data?.[index] && props?.data?.[index].name) || ''}
        underlineColor={'transparent'}
        style={[
          props.style,
          {
            top: 0,
            position: 'absolute',
            width: '100%',
            height: 56,
            backgroundColor: colors.backgroundColor,
          },
        ]}
        editable={false}
        returnKeyType="next"
      />
    </View>
  );
};
