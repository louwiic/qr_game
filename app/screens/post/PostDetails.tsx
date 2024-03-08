import {
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from '@apollo/client';
import moment from 'moment';
import React from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAlert} from '../../../contexts/AlertContext';
import {useAPI} from '../../../contexts/ApiContext';
import {useTheme} from '../../../contexts/ThemeContext';
import {FormInput} from '../../components/FormInput';
import {ImageRemote} from '../../components/ImageRemote';
import {InfiniteFlatList} from '../../components/InfiniteFlatlist';
import {Item} from '../../components/Item';
import {Loader} from '../../components/partials/Loader';
import {ViewWithLoading} from '../../components/ViewWithLoading';
import {globalStyles} from '../../GlobalStyle';
import {useMedia} from '../../hooks/useMedia';
import {ReactNativeFile} from 'apollo-upload-client';

const Header = ({post}) => {
  const {colors} = useTheme();
  const {takePhotoOrGallery} = useMedia();
  const {API} = useAPI();
  const [singleUpload, {loading}] = useMutation(API.SINGLE_UPLOAD, {
    onError: err => {
      console.log('error', err);
    },
    onCompleted: async data => {
      const {singleUpload: uploadSuccess} = data;
      console.log('data', data);
      Alert.alert('Upload', uploadSuccess?.url);
    },
  });
  const {alert, close} = useAlert();

  React.useEffect(() => {
    if (loading) {
      alert(<Loader />);
    } else {
      close();
    }
  }, [loading]);

  const style = StyleSheet.create({
    txt: [globalStyles.regular, {color: colors.black}],
  });
  return (
    <View style={{margin: globalStyles.margin}}>
      <TouchableOpacity
        onPress={() => {
          takePhotoOrGallery(photo => {
            if (photo && photo.uri) {
              const file = new ReactNativeFile({
                uri: photo.uri,
                name: new Date().getTime() + '.png',
                type: 'image/png',
              });
              singleUpload({
                variables: {
                  file: file,
                },
              });
            }
          });
        }}>
        <View style={{height: 50, width: 50, alignSelf: 'center'}}>
          <ImageRemote source={{uri: post?.cover}} />
        </View>
      </TouchableOpacity>

      <Text style={style.txt}>Status : {post?.status}</Text>
      <Text style={style.txt}>Revision : {post?.revision}</Text>
      <Text style={style.txt}>Description : {post?.description}</Text>
      <Text style={style.txt}>
        Debut :{' '}
        {post?.start_at
          ? moment(post?.start_at).format('DD/MM/YYYY hh:mm')
          : ''}
      </Text>
      <Text style={style.txt}>Messages : </Text>
    </View>
  );
};

export const PostDetails = ({route, navigation}) => {
  const {API} = useAPI();
  const {params} = route;
  const insets = useSafeAreaInsets();
  const client = useApolloClient();
  const formMethods = useForm({
    defaultValues: {
      email: route?.params?.email,
    },
  });
  const [createMessage, {loading}] = useMutation(API.SEND_MESSAGE, {
    onCompleted: async () => {
      client.refetchQueries({include: [API.MESSAGES_LIST]});
    },
  });
  const {data: dataSubscription} = useSubscription(API.MESSAGE_SUBSCRIPTION, {
    variables: {post_id: params?.id},
    shouldResubscribe: true,
  });

  const {colors} = useTheme();

  const {data} = useQuery(API.POST, {
    variables: {
      id: params?.id,
    },
  });

  React.useEffect(() => {
    if (dataSubscription) {
      client.refetchQueries({include: [API.MESSAGES_LIST]});
    }
  }, [dataSubscription]);

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: data?.post?.description,
    });
  }, [data]);

  const onSubmit = form => {
    Keyboard.dismiss();
    formMethods.reset({
      message: '',
    });

    createMessage({
      variables: {
        post_id: params?.id,
        text: form.message,
        name: 'ttest',
      },
    });
  };

  const header = React.useMemo(() => {
    return <Header post={data?.post} />;
  }, [data]);

  const onErrors = errors => {
    console.warn('errors', errors);
  };

  return (
    <ViewWithLoading style={{flex: 1}} isLoading={loading}>
      <InfiniteFlatList
        params={{post_id: params.id}}
        query={API.MESSAGES_LIST}
        responseQuery={response => {
          return response?.messagesList?.messages || [];
        }}
        ListHeaderComponent={header}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          return (
            <View style={{marginHorizontal: globalStyles.margin}}>
              <Item template={'message'} data={{item: item}} />
            </View>
          );
        }}
      />
      <View
        style={{
          padding: globalStyles.margin,
          backgroundColor: colors.grayLight,
        }}>
        <FormProvider {...formMethods}>
          <FormInput
            name={'message'}
            placeholder={'Votre message'}
            styleInput={{
              marginTop: 0,
              marginBottom: insets.bottom,
            }}
            right={
              <TextInput.Icon
                name={'send'}
                onPress={formMethods.handleSubmit(onSubmit, onErrors)}
              />
            }
            rules={{
              minLength: {
                value: 1,
                message: 'Le champ doit comporter plus de 3 caractères',
              },
              required: 'Champ obligatoire',
            }}
          />
        </FormProvider>
      </View>
    </ViewWithLoading>
  );
};
