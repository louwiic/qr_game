import React from 'react';
import {Text, View} from 'react-native';
import {useTheme} from '../../../contexts/ThemeContext';
import {globalStyles} from '../../GlobalStyle';

export const EpisodeItem = ({item}) => {
  const {colors} = useTheme();
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        borderRadius: 20,
        alignItems: 'flex-start',
        padding: globalStyles.margin,
      }}>
      <Text
        style={[
          globalStyles.medium,
          {color: colors.black, marginLeft: globalStyles.margin_mid},
        ]}>
        {item.air_date}
      </Text>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Text
          style={[
            globalStyles.medium,
            {color: colors.black, marginLeft: globalStyles.margin_mid},
          ]}>
          {item.episode}
        </Text>
        <Text
          minimumFontScale={9}
          style={[
            globalStyles.regular,
            {color: colors.black, marginLeft: globalStyles.margin_mid},
          ]}>
          {item.name}
        </Text>
      </View>
    </View>
  );
};
