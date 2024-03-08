import React from 'react';
import {Text, View} from 'react-native';
import {useTheme} from '../../../contexts/ThemeContext';
import {globalStyles} from '../../GlobalStyle';
import {ImageRemote} from '../ImageRemote';

export const CharacterItem = ({item}) => {
  const {colors} = useTheme();
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        borderRadius: 20,
        alignItems: 'center',
        flexDirection: 'row',
        padding: globalStyles.margin,
      }}>
      <View
        style={{height: 50, width: 50, overflow: 'hidden', borderRadius: 15}}>
        <ImageRemote source={{uri: item.image}} />
      </View>
      <Text
        style={[
          globalStyles.bold,
          {color: colors.black, marginLeft: globalStyles.margin_mid},
        ]}>
        {item.name}
      </Text>
    </View>
  );
};
