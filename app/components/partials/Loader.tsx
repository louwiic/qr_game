import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {useTheme} from '../../../contexts/ThemeContext';
import {globalStyles} from '../../GlobalStyle';

export const Loader = ({title}) => {
  const {colors} = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.transparent,
      }}>
      <View
        style={{
          backgroundColor: colors.transparent,
          margin: 16,
          flexDirection: 'row',
          alignSelf: 'center',
          alignContent: 'center',
        }}>
        <ActivityIndicator color={colors.white} />
        <Text
          style={[
            [
              globalStyles.medium,
              {
                marginLeft: 6,
                color: colors.white,
                fontSize: 18,
              },
            ],
          ]}>
          {title || 'Chargement...'}
        </Text>
      </View>
    </View>
  );
};
