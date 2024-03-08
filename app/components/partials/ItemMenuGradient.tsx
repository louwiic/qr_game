import MaskedView from '@react-native-community/masked-view';
import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TextInput } from 'react-native-paper';
import { useTheme } from '../../../contexts/ThemeContext';
import {globalStyles} from '../../GlobalStyle';

interface Props {
  onPress: () => void;
  marginTop: any;
  text: string;
  disabled: boolean;
  icon: Image;
}

const ItemMenuGradient: React.FC<Props> = ({
  onPress,
  marginTop,
  text,
  disabled,
  icon
}) => {
  const {colors} = useTheme()
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.7}
      style={{marginTop:10}}
      onPress={onPress}>
      <MaskedView
        style={{
          flex: 1,
          flexDirection: 'row',
          height: '100%',
          width: '90%',
          alignSelf:"center"
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
              borderRadius: 10,
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
          style={[{height: 56, width: '100%'}]}>
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
        style={[
          {
            position: 'absolute',
            alignItems: 'center',
            backgroundColor: '#ffffff10',
            borderRadius: 10,
            height: '100%',
            width: '90%',
            alignSelf:"center",

           justifyContent: 'space-between',
          flex: 1,
          borderRadius: 16,
           padding: globalStyles.margin,
          flexDirection: 'row',

          },
        ]}>
        {/* <Text
          style={{
            fontSize: 16,
            color: '#fff',
            fontFamily: globalStyles.medium.fontFamily,
          }}>
          {text || 'Title'}
        </Text> */}
        <View
          pointerEvents="none"
          style={{width: 40, alignItems: 'center', justifyContent: 'center'}}>
          <Image source={icon} />
        </View>
        <Text
          style={[
            globalStyles.SFProdisplayMedium,
            {
              flex: 1,
              fontWeight: '500',
              fontSize: 15,
              color: colors.white,
            },
          ]}>
          {text}
        </Text>        
      </View>
    </TouchableOpacity>
  );
};
export default ItemMenuGradient;
