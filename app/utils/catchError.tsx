import {Alert} from 'react-native';

export const catchError = message => {
  console.log('MESSAGE', message);
  if (message) {
    if (message === 'not found in database') {
      //Alert.alert('Attention', 'Le mot de passe ou email saisit est incorrect');
    }
  }
};
