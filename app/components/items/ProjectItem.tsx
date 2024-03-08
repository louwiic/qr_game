import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../../contexts/ThemeContext';
import {globalStyles} from '../../GlobalStyle';
import {navigate} from '../../navigations/MainStack';

export const ProjectItem = ({item, mini}) => {
  const {colors} = useTheme();
  return mini ? (
    <TouchableOpacity onPress={() => navigate('ProjectsDetails', item)}>
      <View
        style={{
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.1)',
          width: 50,
          height: 50,
          borderRadius: 20,
          padding: globalStyles.margin,
        }}>
        <Text
          minimumFontScale={9}
          style={[
            globalStyles.regular,
            {color: colors.black, marginLeft: globalStyles.margin_mid},
          ]}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity onPress={() => navigate('ProjectsDetails', item)}>
      <View
        style={{
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.1)',
          borderRadius: 20,
          padding: globalStyles.margin,
        }}>
        <Text
          minimumFontScale={9}
          style={[
            globalStyles.regular,
            {color: colors.black, marginLeft: globalStyles.margin_mid},
          ]}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
