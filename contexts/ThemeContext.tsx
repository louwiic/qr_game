import * as React from 'react';
import {DefaultTheme} from 'react-native-paper';
import {globalStyles} from '../app/GlobalStyle';

const lightColors = {
  backgroundColor: '#ffffff10',
  black: '#111827',
  black_light: '#333111',
  white: '#FFFFFF',
  green: '#00FFA3',
  grayLight: '#DCDFE4',
  gray: '#8796A0',
  placeholder: '#ffffff30',
  btnBg: '#ffffff10',
  red: '#FF485E',
  purple: '#9297F8',
  activeColor: '#ffffff10',
  transparent: 'transparent'
};

const darkColors = {
  backgroundColor: '#000',
  black: '#000',
  black_light: '#CCCCCC',
  white: '#000000',
  grayLight: '#333311',
  gray: '#8796A0',
  gray400: '#969FAF',
  btnBg: '#ffffff10',
  placeholder: '#ffffff30',
  red: '#FF485E',
  purple: '#9297F8',
  activeColor: '#ffffff10',
  transparent: 'transparent'
};

export const ThemeContext = React.createContext({
  isDark: false,
  colors: lightColors,
  setScheme: () => {},
});

export const ThemeProvider = props => {
  const colorScheme = 'light';
  const [isDark, setIsDark] = React.useState(colorScheme === 'dark');
  const colors = React.useMemo(() => (isDark ? darkColors : lightColors));

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        colors: colors,
        theme: {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            primary: colors.btnBg,
            card: colors.white,
            text: colors.white,
            border: colors.purple,
            notification: colors.btnBg,
            background: colors.backgroundColor,
            placeholder: colors.placeholder,
            error: colors.red,
          },
          roundness: globalStyles.roundness,
          fonts: {
            light: globalStyles.light,
            regular: globalStyles.regular,
            medium: globalStyles.medium,
            thin: globalStyles.light,
          },
        },
        setScheme: scheme => setIsDark(scheme === 'dark'),
      }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => React.useContext(ThemeContext);
