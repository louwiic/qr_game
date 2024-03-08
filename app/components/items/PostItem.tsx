import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../../contexts/ThemeContext';
import {globalStyles} from '../../GlobalStyle';
import {navigate} from '../../navigations/MainStack';
import {ImageRemote} from '../ImageRemote';

export const PostItem = ({item}) => {
  const {colors} = useTheme();
  return (
    <TouchableOpacity onPress={() => navigate('PostDetails', item)}>
      <View
        style={{
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.1)',
          borderRadius: 10,
          alignItems: 'center',
          padding: globalStyles.margin,
        }}>
        <Text
          style={[
            globalStyles.regular,
            {
              color: colors.black,

              textAlign: 'center',
              margin: globalStyles.margin_mid,
            },
          ]}>
          {`Status : ${item.status}`}
        </Text>
        <ImageRemote
          source={{uri: item.cover}}
          style={{
            height: 50,
            width: 50,
            borderRadius: 25,
          }}
        />
        <Text
          numberOfLines={2}
          style={[
            globalStyles.regular,
            {
              color: colors.black,

              textAlign: 'center',
              margin: globalStyles.margin_mid,
            },
          ]}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
