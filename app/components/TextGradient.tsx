import MaskedView from '@react-native-community/masked-view';
import React, {Component} from 'react';
import {Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GradientText = props => (
  <MaskedView maskElement={<Text {...props} />}>
    <LinearGradient
      colors={['#FFD407', '#FFD94D', '#FFB800']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}>
      <Text {...props} style={[props.style, {opacity: 0}]} />
    </LinearGradient>
  </MaskedView>
);
export default GradientText;
