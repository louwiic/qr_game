import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import React from 'react';
import auth from '@react-native-firebase/auth';
import {View} from 'react-native';
import {useAlert} from '../../contexts/AlertContext';
import {Loader} from './partials/Loader';
import {globalStyles} from '../GlobalStyle';
import {useLazyQuery, useMutation} from '@apollo/client';
import {useAPI} from '../../contexts/ApiContext';
export const GoogleBtn = props => {
  const {alert, close} = useAlert();
  const {API, signIn} = useAPI();
  const [exist] = useLazyQuery(API.EXIST_USER);

  const success = async credentials => {
    await signIn({
      access_token: credentials?.access,
      refresh_token: credentials?.refresh,
    });
    navigation.reset({
      index: 0,
      routes: [{name: 'TabStack'}],
    });
  };

  const [register] = useMutation(API.REGISTER_PROVIDER, {
    onError: () => {
      close();
    },
    onCompleted: async data => {
      close();
      const {existUser} = data;

      if (existUser?.access && existUser?.refresh) {
        success(loginSuccess);
      }
    },
  });
  const [login] = useMutation(API.LOGIN_PROVIDER, {
    onError: () => {
      close();
    },
    onCompleted: async data => {
      close();
      const {existUser} = data;
      if (existUser?.access && existUser?.refresh) {
        success(loginSuccess);
      }
    },
  });

  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '152458804709-f7dlsm5mhhavivgdi25tgd2erb9gacer.apps.googleusercontent.com',
    });
  }, []);

  const failure = error => {
    //console.error('error', error);
    close();
  };

  const onPress = async () => {
    try {
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      failure(error);
    }
  };

  return (
    <View style={props.style}>
      <GoogleSigninButton
        onPress={() => {
          alert(<Loader />);
          onPress().then(async res => {
            try {
              const user = res.user;
              const idToken = await auth().currentUser.getIdToken(true);
              await auth().signOut();
              await GoogleSignin.signOut();
              exist({
                variables: {
                  firebase_uid: idToken,
                },
                onCompleted: exists => {
                  if (exists?.existUser) {
                    login({
                      variables: {
                        firebase_id_token: idToken,
                        firebase_uid: user?.uid,
                      },
                    });
                  } else {
                    register({
                      variables: {
                        email: user?.email,
                        firebase_id_token: idToken,
                        firebase_uid: user?.uid,
                        firebase_provider: res.additionalUserInfo.providerId,
                      },
                    });
                  }
                },
              });
            } catch (error) {
              failure(error);
            }
          });
        }}
        style={{
          height: 56,
          alignSelf: 'center',
          borderRadius: 23,
          marginVertical: globalStyles.margin_mid,
        }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
      />
    </View>
  );
};
