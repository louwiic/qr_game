import MaskedView from '@react-native-community/masked-view';
import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface GradientTextProps {
  colors: string[];
  [x: string]: any;
}

const GradientText = ({colors, ...rest}: GradientTextProps) => {
  return (
    <MaskedView maskElement={<Text {...rest} />}>
      <LinearGradient colors={colors} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
        <Text {...rest} style={[rest.style, {opacity: 0}]} />
      </LinearGradient>
    </MaskedView>
  );
};

const BorderButton = () => {
  /* return (
    <SafeAreaView style={styles.container}>
      <GradientText colors={['#cc2b5e', '#753a88']} style={styles.text}>
        GRADIENT TEXT
      </GradientText>
    </SafeAreaView>
  ); */
  return (
    <>
      <LinearGradient
        colors={['#cc2b5e', '#753a88']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.linearGradient}>
        <View style={styles.innerContainer}>
          <Text style={styles.buttonText}>GRADIENT BORDER</Text>
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 35,
    fontFamily: 'Gill Sans',
    fontWeight: 'bold',
  },
  linearGradient: {
    height: 150,
    width: 200,
    borderRadius: 20, // <-- Outer Border Radius
  },
  innerContainer: {
    borderRadius: 15, // <-- Inner Border Radius
    flex: 1,
    margin: 5, // <-- Border Width
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    color: '#cc2b5e',
    backgroundColor: 'transparent',
  },
});
export default BorderButton;
