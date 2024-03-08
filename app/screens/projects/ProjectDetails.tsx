import {useQuery} from '@apollo/client';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useAPI} from '../../../contexts/ApiContext';
import {useTheme} from '../../../contexts/ThemeContext';
import {InfiniteFlatList} from '../../components/InfiniteFlatlist';
import {Item} from '../../components/Item';
import {ViewWithLoading} from '../../components/ViewWithLoading';
import {globalStyles} from '../../GlobalStyle';
import crashlytics from '@react-native-firebase/crashlytics';

const Header = ({project}) => {
  const {colors} = useTheme();
  const style = StyleSheet.create({
    txt: [globalStyles.regular, {color: colors.black}],
  });
  return (
    <View style={{margin: globalStyles.margin}}>
      <Text style={style.txt}>Nom : {project?.name}</Text>
      <Text style={style.txt}>Créer le : {project?.created_at}</Text>
      <Text style={style.txt}>Email : {project?.email}</Text>
      <Text style={style.txt}>Post : </Text>
    </View>
  );
};

export const ProjectsDetails = ({route, navigation}) => {
  const {API} = useAPI();
  const {params} = route;
  const {data, loading} = useQuery(API.PROJECT, {
    variables: {
      id: params?.id,
    },
  });

  React.useEffect(() => {
    crashlytics().log('Updating user count.');
    navigation.setOptions({
      headerTitle: data?.project?.name,
    });
  }, [data]);

  const header = React.useMemo(() => {
    return <Header project={data?.project} />;
  }, [data]);

  return (
    <ViewWithLoading isLoading={loading} style={{flex: 1}}>
      <InfiniteFlatList
        params={{project: params.id}}
        query={API.POSTS_LIST}
        responseQuery={response => {
          return response?.postsList?.posts || [];
        }}
        ListHeaderComponent={header}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          return (
            <View style={{marginHorizontal: globalStyles.margin}}>
              <Item template={'post'} data={{item: item}} />
            </View>
          );
        }}
      />
    </ViewWithLoading>
  );
};
