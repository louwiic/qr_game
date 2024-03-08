import React, {useEffect, useState, useRef} from 'react';
import {View, TouchableOpacity, Image, Keyboard} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  Easing,
  EasingNode,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {BlurView} from '@react-native-community/blur';
import {useTheme} from '../../../contexts/ThemeContext';

const SIZE = 100.0;
const RenderTab = ({state, descriptors, navigation, route, index}) => {
  const {options} = descriptors[route.key];
  const label =
    options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
      ? options.title
      : route.name;
  const isFocused = state.index === index;

  const progress = useSharedValue(1);
  const scale = useSharedValue(2);
  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      borderRadius: (progress.value * 100) / 2,
      transform: [{scale: scale.value}],
    };
  }, []);

  //const heightAnim = useRef(new Animated.Value(70)).current;
  const radiusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    /* if (isFocused) {
      progress.value = withTiming(0.8, {
        duration: 5000,
        //easing: Easing.out(Easing.exp),
      });
      scale.value = withSpring(2);
    } */
    Animated.timing(radiusAnim, {
      toValue: state.index === index ? 25 : 0,
      duration: 400,
      easing: EasingNode.linear,
    }).start();

    /*  Animated.timing(radiusAnim, {
      toValue: state.index === index ? 25 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start(); */
  }, [state]);

  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };
  return (
    <View
      key={index}
      style={{
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        height: 80,
      }}>
      <TouchableOpacity
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={isFocused ? {selected: true} : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        onPress={onPress}
        onLongPress={onLongPress}
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 14,
        }}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: 90,
              height: 100,
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: isFocused ? '#FFFFFF10' : null,
              backgroundColor: 'transparent',
              /*borderTopLeftRadius:25,
              borderBottomLeftRadius: radiusAnim,
              borderBottomRightRadius: radiusAnim,*/
            },
          ]}>
          {options.tabBarIcon({
            color: isFocused ? '' : 'white',
            focused: isFocused,
          })}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export const CustomTabBar = ({state, descriptors, navigation}) => {
  const {colors, isDark} = useTheme();
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  const [fall, setFall] = React.useState(new Animated.Value(1));
  const insets = useSafeAreaInsets();
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);
  const [route, setRoute] = useState('');
  const [routeName, setRouteName] = useState('');
  useEffect(() => {
    setRoute('');
    state.routes.forEach(r => {
      if (r.state && r.state.index) {
        // console.log('Name', r.state.routes[r.state.index].name);
        setRoute(r.state.routes[r.state.index].name);
      }
    });
    setRouteName('');
    state.routes.map((route, index) => {
      const isFocused = state.index === index;
      if (isFocused) {
        setRouteName(route.name);
        // console.log('route', JSON.stringify(route.name));
      }
    });
  }, [state]);
  function getTabBarVisible(route) {
    switch (route) {
      case 'VirementView':
        return false;
      case 'VerificationView':
        return false;
      case 'WebPageView':
        return false;
      default:
        return true;
    }
  }
  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  if (focusedOptions.tabBarVisible === false || isKeyboardVisible) {
    return null;
  }
  return (
    <BlurView
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height:80,
        }}
        blurType="dark"
        blurAmount={10}    
        //overlayColor="#FFF"
        //reducedTransparencyFallbackColor="white"
        //blurAmount={20}
        //blurRadius={0}
        //overlayColor="#FFF"
        >
    <View
      style={{
        overflow:"visible",
        display: getTabBarVisible(route) ? 'flex' : 'none',
      }}>
      
        <Animated.View
          style={{
            top: fall.interpolate({
              inputRange: [0, 1],
              outputRange: [150, 0],
              extrapolate: Animated.Extrapolate.CLAMP,
            }),
            backgroundColor: colors.headerBlack,
            flexDirection: 'row',
            paddingBottom: insets.bottom,
            elevation: 50,
            zIndex: 9999,
          }}>
          {state.routes.map((route, index) => {
            return (
              <RenderTab
                navigation={navigation}
                descriptors={descriptors}
                route={route}
                index={index}
                state={state}
              />
            );
          })}
        </Animated.View>
     
    </View>
    </BlurView>
  );
};
