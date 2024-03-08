/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {globalStyles} from './app/GlobalStyle';
import {MainStack} from './app/navigations/MainStack';
import {AlertCustomProvider} from './contexts/AlertContext';
import {NetworkProvider, useNetwork} from './contexts/NetworkContext';
import {useTheme} from './contexts/ThemeContext';

export const App = () => {
  const {theme} = useTheme();

  return (
    <PaperProvider theme={theme}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'height'}
        enabled
        style={{flexGrow: 1, height: '100%'}}>
        <SafeAreaProvider>
          <NetworkProvider>
            <StatusBar
              translucent={true}
              backgroundColor={'transparent'}
              barStyle={'dark-content'}
            />
            <LaunchContextAndApp />
          </NetworkProvider>
        </SafeAreaProvider>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
};

const LaunchContextAndApp = () => {
  const {internet} = useNetwork();
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    if (internet) {
      //queryClient.refetchQueries();
    }
  }, [internet]);

  return (
    <AlertCustomProvider>
      {!internet && (
        <View
          style={{
            width: '100%',
            paddingBottom: insets.bottom,
            backgroundColor: colors.white,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={[globalStyles.regular, {color: colors.btnBg, fontSize: 12}]}>
            Aucune connexion
          </Text>
        </View>
      )}
      <StatusBar
        // backgroundColor={colors.cardColor}
        barStyle={'light-content'}
      />
      <MainStack />
    </AlertCustomProvider>
  );
};
