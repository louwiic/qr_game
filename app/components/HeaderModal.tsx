import React from 'react';
import {View, Text} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {globalStyles} from '../GlobalStyle';

export const HeaderModal = ({title, subtitle}) => {
  const {colors} = useTheme();
  return (
    <View style={{marginBottom: globalStyles.margin_large}}>
      <Text
        style={[
          globalStyles.bold,
          {fontSize: 24, letterSpacing: 0.48, color: colors.black},
        ]}>
        {title}
      </Text>
      <Text
        style={[
          globalStyles.regular,
          {
            opacity: 0.48,
            letterSpacing: 0.16,
            lineHeight: 24,
            marginTop: 12,
            fontSize: 15,
            color: colors.black,
          },
        ]}>
        {subtitle}
      </Text>
    </View>
  );
};
