import * as React from 'react';
import {ActivityIndicator, Image, View} from 'react-native';
import {urlImage} from '../utils/urlImages';
import FastImage from 'react-native-fast-image';
import {useTheme} from '../../contexts/ThemeContext';

export const ImageRemote = props => {
  const {colors} = useTheme();
  const [loading, setLoading] = React.useState(false);
  const image = urlImage(props?.source?.uri);
  const normalisedSource =
    (image && typeof image === 'string' && !image.split('http')[1]) || !image
      ? null
      : {uri: image};

  return (
    <View
      style={[
        {
          backgroundColor: 'rgba(255,255,255,0.1)',
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
        },
        props.style,
      ]}>
      {props.noFast ? (
        <Image
          style={[
            props.imageStyle,
            {
              width: '100%',
              height: '100%',
              backgroundColor: props.backgroundColor || colors.grayLight,
            },
          ]}
          onLoadStart={() => {
            normalisedSource && setLoading(true);
          }}
          onError={() => {
            setLoading(false);
          }}
          onLoadEnd={() => {
            setLoading(false);
          }}
          resizeMode={props.resizeMode}
          source={normalisedSource}
        />
      ) : (
        <FastImage
          style={[
            props.imageStyle,
            {
              width: '100%',
              height: '100%',
              borderRadius: 20,
              backgroundColor: props.backgroundColor || colors.grayLight,
            },
          ]}
          onLoadStart={() => {
            normalisedSource && setLoading(true);
          }}
          onLoadEnd={() => setLoading(false)}
          resizeMode={props.resizeMode}
          source={normalisedSource}
        />
      )}

      {loading && !props.noLoader && (
        <View
          style={{
            position: 'absolute',
            alignSelf: 'center',
            zIndex: 1,
          }}>
          <ActivityIndicator color={colors.btnBg} />
        </View>
      )}
    </View>
  );
};
