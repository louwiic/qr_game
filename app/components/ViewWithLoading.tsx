import React from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {globalStyles} from '../GlobalStyle';

export const ViewWithLoading = props => {
  const {colors} = useTheme();
  return (
    <View style={props.style}>
      {props.isLoading && (
        <View
          style={{
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator color={colors.btnBg} />
          <Text style={[globalStyles.medium, {margin: 6, color: 'white'}]}>
            {props.textLoading ? props.textLoading : ''}
          </Text>
        </View>
      )}
      <View
        style={[
          {flexGrow: 1},
          props.styleContained,
          {
            display:
              !props.isLoading && !props.internetRequired ? null : 'none',
          },
        ]}>
        {props.children}
      </View>
    </View>
  );
};
