import moment from 'moment';
import React from 'react';
import {Text, View} from 'react-native';
import {useTheme} from '../../../contexts/ThemeContext';
import {globalStyles} from '../../GlobalStyle';

export const MessageItem = ({item}) => {
  const {colors} = useTheme();
  return (
    <View>
      <Text
        minimumFontScale={9}
        style={[globalStyles.regular, {color: colors.black}]}>
        {moment(item.created_at).fromNow()}
      </Text>
      <View
        style={{
          borderTopRightRadius: 20,
          borderBottomLeftRadius: 20,
          backgroundColor: 'rgba(0,0,0,0.1)',
          alignItems: 'flex-start',
          padding: globalStyles.margin,
        }}>
        <Text
          minimumFontScale={9}
          style={[
            globalStyles.regular,
            {color: colors.black, marginLeft: globalStyles.margin_mid},
          ]}>
          {item.text}
        </Text>
      </View>
      {item.updated && (
        <Text
          minimumFontScale={9}
          style={[
            globalStyles.regular,
            {color: colors.black, marginLeft: globalStyles.margin_mid},
          ]}>
          edited
        </Text>
      )}
    </View>
  );
};
