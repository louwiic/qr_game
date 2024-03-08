import {Alert, PermissionsAndroid, Platform} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

export const useMedia = () => {
  const takePicture = cb => {
    if (Platform.OS === 'ios') {
      ImagePicker.launchCamera({quality: 0.2, mediaType: 'photo'}, e => {
        if (e?.assets?.[0]?.fileName) {
          cb(e?.assets?.[0]);
        }
      });
    } else {
      (async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            ImagePicker.launchCamera({quality: 0.2, mediaType: 'photo'}, e => {
              if (e?.assets?.[0]?.fileName) {
                cb(e?.assets?.[0]);
              }
            });
          } else {
            Log('Camera permission denied');
          }
        } catch (err) {
          Log(err);
        }
      })();
    }
  };
  const openGallery = cb => {
    ImagePicker.launchImageLibrary({quality: 0.2, mediaType: 'photo'}, e => {
      if (e?.assets?.[0]?.fileName) {
        cb(e?.assets?.[0]);
      }
    });
  };

  const takePhotoOrGallery = cb => {
    Alert.alert(
      'Prendre une photo',
      'Que voulez-vous faire?',
      [
        {text: 'Annuler', onPress: () => {}},
        {
          text: 'Prendre une photo',
          onPress: () => {
            takePicture(cb);
          },
        },
        {
          text: 'Ouvrir la galerie',
          onPress: () => {
            openGallery(cb);
          },
        },
      ],
      {cancelable: false},
    );
  };

  return {takePhotoOrGallery, takePicture, openGallery};
};
