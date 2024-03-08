import {Linking} from 'react-native';

export const handlerNotification = data => {
  if (data?.url) {
    Linking.openURL(data.url);
  }
};
