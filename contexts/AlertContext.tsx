import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {Card, Dialog, Portal} from 'react-native-paper';
import {useTheme} from './ThemeContext';

export const AlertCustomContext = React.createContext({
  isOpen: false,
  container: () => {},
  alert: () => {},
  close: () => {},
});

export const AlertCustomProvider = props => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [container, setContainer] = React.useState(<View />);
  const {colors, isDark, theme} = useTheme();
  const styles = StyleSheet.create({
    container: {
      padding: 24,
      borderRadius: 24,
      elevation: 0,
      borderColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
      borderWidth: 1,
      overflow: 'hidden',
      backgroundColor: colors.backgroundColor,
    },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    button: {
      marginTop: 16,
    },
  });
  const alert = cont => {
    setContainer(cont);
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
  };

  const defaultAlertCustom = {
    isOpen: isOpen,
    container: container,
    alert: alert,
    close: close,
  };

  return (
    <AlertCustomContext.Provider value={defaultAlertCustom}>
      <Portal theme={theme}>
        <Dialog
          theme={theme}
          dismissable={false}
          style={{backgroundColor: 'transparent'}}
          onDismiss={close}
          visible={isOpen}>
          <Card disabled={true} theme={theme} style={styles.container}>
            {container}
          </Card>
        </Dialog>
      </Portal>

      {props.children}
    </AlertCustomContext.Provider>
  );
};

export const useAlert = () => React.useContext(AlertCustomContext);
