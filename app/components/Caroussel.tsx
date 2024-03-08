import React, {useRef} from 'react';
import {View, Dimensions, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {interpolateColors} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import {globalStyles} from '../GlobalStyle';
import {useTheme} from '../../contexts/ThemeContext';
import MaskedView from '@react-native-community/masked-view';
import {TouchableOpacity} from 'react-native-gesture-handler';

export const Page = () => {
  const {colors} = useTheme();
  return (
    <View
      style={{
        width: Dimensions.get('screen').width - globalStyles.margin * 2,
        margin: globalStyles.margin,
        height: 50,
        aspectRatio: 327 / 188,
        backgroundColor: colors.grayDark,
        borderRadius: 12,
      }}>
      <LinearGradient
        style={{
          position: 'absolute',
          height: '100%',
          opacity: 0.8,
          width: '100%',
          top: 0,
          bottom: 0,
        }}
        start={{x: 0, y: 1}}
        end={{x: 0, y: 0}}
        colors={['#041D2E', 'rgba(255, 255, 255, 0.1)']}
      />
    </View>
  );
};

export const Indicator = ({page, xOffset}) => {
  const {colors} = useTheme();

  return (
    <Animated.View
      style={{
        backgroundColor: interpolateColors(xOffset, {
          inputRange: [
            (page - 1) * Dimensions.get('window').width,
            page * Dimensions.get('window').width,
            (page + 1) * Dimensions.get('window').width,
          ],
          outputColorRange: [colors.grayLight, colors.green, colors.grayLight],
          extrapolate: Animated.Extrapolate.CLAMP,
        }),
        width: xOffset.interpolate({
          inputRange: [
            (page - 1) * Dimensions.get('window').width,
            page * Dimensions.get('window').width,
            (page + 1) * Dimensions.get('window').width,
          ],
          outputRange: [10, 30, 10],
          extrapolate: Animated.Extrapolate.CLAMP,
        }),
        marginHorizontal: 2,
        marginBottom: '11%',
        height: 4,
        borderRadius: 3,
      }}
    />
  );
};

export const Caroussel = props => {
  const [pageWidth, setPageWidth] = React.useState(
    Dimensions.get('window').width,
  );
  const xOffset = new Animated.Value(0);
  var i = 0;

  /* const next = () => {
    //scrollViewRef.current?.scrollTo({x: 1 * pageWidth, animated: true});
    if (i++ < 3) {
       scrollViewRef.current?.scrollTo({
        x: i++ * pageWidth,
        animated: true,
      });
    }
  }; */

  return (
    <Animated.View style={[props.style]}>
      <Animated.ScrollView
        ref={props.scrollViewRef}
        overScrollMode="never"
        style={{
          zIndex: 3,
          width: Dimensions.get('screen').width,
        }}
        onLayout={e => {
          let event = e.nativeEvent;
          setPageWidth(event.layout.width);
        }}
        bounces={false}
        scrollEventThrottle={1}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: x =>
                    Animated.block([
                      Animated.set(props.callback || xOffset, x),
                      Animated.call([x], obj => {
                        if (props.onChange) {
                          props.onChange(
                            Math.round(obj / pageWidth),
                            pageWidth,
                          );
                        }
                      }),
                    ]),
                },
              },
            },
          ],
          {
            useNativeDriver: true,
          },
        )}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}>
        {props.children}
      </Animated.ScrollView>

      <View
        style={[
          {
            zIndex: 99,
            position: 'absolute',
            bottom: 56,
            alignSelf: 'center',
            flexDirection: 'row',
          },
          props.styleIndicatorGroup,
        ]}>
        {props.children?.length > 1 &&
          props.children?.map((element, index) => {
            return (
              <Indicator
                key={index}
                page={index}
                pageWidth={pageWidth}
                xOffset={props.callback || xOffset}
              />
            );
          })}
      </View>
    </Animated.View>
  );
};
