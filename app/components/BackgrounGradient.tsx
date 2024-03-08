import React, {Component} from 'react';
import {ImageBackground, StyleProp, View} from 'react-native';

type props = {
  children: React.ReactNode;
  style: StyleProp
};

const BackgroundGradient = ({children, style}: props) => {
  return (
    <ImageBackground source={require('../assets/splash.png')} style={[{flex:1, style}]}>
      {children}
    </ImageBackground>
  );
};
export default BackgroundGradient;
