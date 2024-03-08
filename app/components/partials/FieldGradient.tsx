import MaskedView from '@react-native-community/masked-view';
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {globalStyles} from '../../GlobalStyle';

interface Props {
  onPress: () => void;
  marginTop: any;
  text: string;
  disabled: boolean;
}

const FieldGradient: React.FC<Props> = ({
  onPress,
  marginTop,
  text,
  disabled,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.7}
      style={{marginTop: 20}}
      onPress={onPress}>
      <MaskedView
        style={{
          flex: 1,
          flexDirection: 'row',
          height: '100%',
          width: '100%',
        }}
        maskElement={
          <View
            style={{
              // Transparent background because mask is based off alpha channel.
              backgroundColor: 'transparent',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderRadius: 8,
            }}
          />
        }>
        {/* Shows behind the mask, you can put anything here, such as an image */}
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 0.8, y: 0}}
          colors={[
            'rgba(146,151,248,0.82)',
            'rgba(200, 202, 251, 0.54)',
            'rgba(255, 255, 255, 0.25)',
            'rgba(255, 255, 255, 0.28)',
            'rgba(102, 246, 246, 0.62)',
            'rgba(255, 255, 255, 0.23)',
            'rgba(233, 101, 255, 0.64)',
          ]}
          style={[{height: 48, width: 214}]}>
          {/*  <Text
                style={{
                  fontSize: 60,
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                Envoyer
              </Text> */}
        </LinearGradient>
      </MaskedView>
      <View
        style={{
          height: 48,
          width: 214,
          borderRadius: 8,
          //marginTop: 20,
          backgroundColor: '#ffffff10',
        }}
      />
    </TouchableOpacity>
  );
};

export default FieldGradient;
