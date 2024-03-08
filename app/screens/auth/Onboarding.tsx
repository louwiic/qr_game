import MaskedView from '@react-native-community/masked-view';
import React, {useRef} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Button} from 'react-native-paper';
import Animated, {scrollTo} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import {useTheme} from '../../../contexts/ThemeContext';
import {Caroussel} from '../../components/Caroussel';
import {GoogleBtn} from '../../components/GoogleBtn';
import {globalStyles} from '../../GlobalStyle';
import {navigate} from '../../navigations/MainStack';
import BorderedButton from './BorderButton';

const Page = ({
  title,
  subtitle,
  fall,
  index,
  page,
  next,
  onLoadTutorial,
  navigation,
  step,
}) => {
  const {colors} = useTheme();
  return (
    <SafeAreaView
      style={{
        width: Dimensions.get('window').width,
      }}>
      {/* <View style={{height: '100%'}}>
        <LinearGradient
          style={{
            position: 'absolute',
            height: '70%',
            opacity: 1,
            width: '100%',
            bottom: 0,
          }}
          start={{x: 0, y: 1}}
          end={{x: 0, y: 0}}
          colors={[colors.backgroundColor, 'rgba(255, 255, 255, 0.0)']}
        />
      </View> */}
      <View>
        <TouchableOpacity
          onPress={() => {
            onLoadTutorial('false');
            navigate('Login');
          }}>
          <Text
            style={{position: 'absolute', top: 40, right: 40, color: '#FFF'}}>
            Passer
          </Text>
        </TouchableOpacity>
      </View>
      <Animated.View
        style={{
          bottom: globalStyles.margin_large,
          left: globalStyles.margin_large,
          right: globalStyles.margin_large,
          position: 'absolute',
          /* opacity: fall.interpolate({
            inputRange: [
              (index - 1) * Dimensions.get('window').width +
                Dimensions.get('window').width / 1.5,
              index * Dimensions.get('window').width,
            ],
            outputRange: [0, 1],
            extrapolate: Animated.Extrapolate.CLAMP,
          }), */
        }}>
        <Button
          style={{
            marginHorizontal: globalStyles.margin,
            marginVertical: globalStyles.margin_mid,
            marginBottom: '25%',
            borderColor: '#E965FF64',
            borderRadius: 10,
          }}
          onPress={() => {
            next(index, step);
          }}
          contentStyle={{
            height: 56,
          }}
          uppercase={false}
          labelStyle={[
            globalStyles.bold,
            {
              fontSize: 15,
            },
          ]}
          color="#ffffff"
          mode="outlined">
          Suivant
        </Button>
        {title && (
          <>
            <Text
              style={[
                globalStyles.medium,
                {
                  color: colors.black,
                  textAlign: 'center',
                  fontSize: 28,
                },
              ]}>
              {title}
            </Text>
          </>
        )}
        {subtitle && (
          <Text
            style={[
              globalStyles.regular,
              {
                lineHeight: 24,
                color: colors.black_light,
                textAlign: 'center',
                marginTop: globalStyles.margin_mid,
                marginBottom: 32,
                fontSize: 16,
              },
            ]}>
            {subtitle + '\n'}
          </Text>
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

export const Onboarding = ({onLoadTutorial, navigation}) => {
  const fall = React.useRef(new Animated.Value(0)).current;
  const [page, setPage] = React.useState(0);
  const [pageWidth, setPageWith] = React.useState(0);
  const scrollViewRef = useRef();
  const [images] = React.useState([
    require('../../assets/splash.png'),
    require('../../assets/splash.png'),
    require('../../assets/splash.png'),
  ]);

  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  const next = (page, step) => {
    //console.log(page++);
    if (step === 'login') {
      onLoadTutorial('false');
      navigate('Login');
    }
    page++;
    scrollViewRef.current?.scrollTo({
      x: page * pageWidth,
      animated: true,
    });
  };

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        {images.map((e, index) => {
          return (
            <Animated.Image
              resizeMode="cover"
              key={index}
              style={{
                zIndex: -100,
                position: 'absolute',
                height: '100%',
                /* opacity: fall.interpolate({
                  inputRange: [
                    (index - 1) * Dimensions.get('window').width,
                    index * Dimensions.get('window').width,
                    (index + 1) * Dimensions.get('window').width,
                  ],
                  outputRange: [0, 1, 0],
                  extrapolate: Animated.Extrapolate.CLAMP,
                }), */
                width: '100%',
              }}
              source={e}
            />
          );
        })}

        <Caroussel
          scrollViewRef={scrollViewRef}
          onChange={(page, pageWidth) => {
            setPageWith(pageWidth);
          }}
          callback={fall}
          style={{flex: 1}}
          styleIndicatorGroup={{bottom: globalStyles.margin_large}}>
          <Page
            onLoadTutorial={onLoadTutorial}
            fall={fall}
            index={0}
            next={next}
            navigation={navigation}
            //title="TITLE 1"
            //subtitle="Lorem ipsum dolor sit amet. Aut unde temporibus et velit maiores et praesentium repudiandae ut sint alias. Id quia possimus id quia rerum qui expedita deleniti aut aliquid dolore est voluptas debitis et labore aliquid non minus aliquid."
          />
          <Page
            onLoadTutorial={onLoadTutorial}
            fall={fall}
            index={1}
            next={next}
            navigation={navigation}
            //title="TITLE 2"
            //subtitle="Lorem ipsum dolor sit amet. Aut unde temporibus et velit maiores et praesentium repudiandae ut sint alias. Id quia possimus id quia rerum qui expedita deleniti aut aliquid dolore est voluptas debitis et labore aliquid non minus aliquid."
          />
          <Page
            onLoadTutorial={onLoadTutorial}
            fall={fall}
            index={2}
            next={next}
            navigation={navigation}
            step="login"
            //title="TITLE 3"
            //subtitle="Lorem ipsum dolor sit amet. Aut unde temporibus et velit maiores et praesentium repudiandae ut sint alias. Id quia possimus id quia rerum qui expedita deleniti aut aliquid dolore est voluptas debitis et labore aliquid non minus aliquid."
          />
        </Caroussel>
      </View>

      {/* <GoogleBtn /> */}

      {/* <Button
        style={{
          marginHorizontal: globalStyles.margin,
          marginVertical: globalStyles.margin_mid,
        }}
        onPress={() => {
          navigate('Signup');
        }}
        contentStyle={{
          height: 56,
        }}
        uppercase={false}
        labelStyle={[
          globalStyles.bold,
          {
            fontSize: 15,
          },
        ]}
        mode="outlined">
        SIGNUP
      </Button>

      <Button
        style={{
          marginHorizontal: globalStyles.margin,
          marginVertical: globalStyles.margin_mid,
        }}
        onPress={() => {
          navigate('Login');
        }}
        contentStyle={{
          height: 56,
        }}
        uppercase={false}
        labelStyle={[
          globalStyles.bold,
          {
            fontSize: 15,
          },
        ]}
        mode="contained">
        LOGIN
      </Button> */}

      {/* <View style={{height: 48}} /> */}
    </View>
  );
};
