import React from 'react';
import {View, TouchableWithoutFeedback} from 'react-native';
import {Checkbox} from 'react-native-paper';
import {useTheme} from '../../contexts/ThemeContext';

export const CheckboxText = props => {
  const {colors} = useTheme();
  const [enabled, isEnabled] = React.useState(props.initValue || false);
  React.useEffect(() => {
    if (props.callback) {
      props.callback(enabled);
    }
  }, [enabled]);

  React.useEffect(() => {
    isEnabled(props.initValue);
  }, [props.initValue]);

  return (
    <TouchableWithoutFeedback
      disabled={props?.disabled}
      onPress={() => {
        isEnabled(!enabled);
        if (props.callback2) {
          props.callback2(!enabled);
        }
      }}>
      <View
        style={[
          props.style,
          {
            alignItems: 'center',
            alignContent: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          },
        ]}>
        <View
          style={{
            alignSelf: 'flex-start',
          }}>
          <Checkbox.Android
            color={props.color || colors.btnBg2}
            uncheckedColor={colors.placeholder}
            status={enabled ? 'checked' : 'unchecked'}
          />
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            if (props?.clickTxt) {
              props?.clickTxt();
            }
          }}>
          {props.placeholder}

          {/* {props.customComponent && (
            <Text
              style={[
                globalStyles.regular,
                {
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: '500',
                  letterSpacing: 0.5,
                  flex: 1,
                  color: colors.black2,
                },
                props.styleText,
              ]}>
              {props.placeholder}
            </Text>
          )} */}
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};
