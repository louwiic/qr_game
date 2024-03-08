import * as React from 'react';
import NetInfo from '@react-native-community/netinfo';
import {AppState} from 'react-native';

export const useNetwork = () => React.useContext(NetworkContext);

export const NetworkContext = React.createContext({
  internet: false,
});

export const NetworkProvider = props => {
  const [internet, setInternet] = React.useState(true);

  const checkInternet = () => {
    (async () => {
      try {
        const response = await fetch('https://1.1.1.1', {method: 'HEAD'});
        setInternet(response.ok);
      } catch (error) {
        setInternet(false);
      }
    })();
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      NetInfo.fetch().then(checkInternet);
    }, 2000);

    const subscription = AppState.addEventListener('change', checkInternet);
    NetInfo.addEventListener(checkInternet);
    return () => {
      clearTimeout(timeout);
      subscription.remove();
    };
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        internet: internet,
      }}>
      {props.children}
    </NetworkContext.Provider>
  );
};
