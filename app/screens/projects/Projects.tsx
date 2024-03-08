import React from 'react';
import {View} from 'react-native';
import {useAPI} from '../../../contexts/ApiContext';
import {InfiniteFlatList} from '../../components/InfiniteFlatlist';
import {Item} from '../../components/Item';
import {globalStyles} from '../../GlobalStyle';

export const Projects = () => {
  const {API} = useAPI();

  return (
    <View style={{flex: 1, paddingVertical: globalStyles.margin_large}}>
      <InfiniteFlatList
        query={API.PROJECT_LIST}
        responseQuery={response => {
          return response?.projectsList?.projects || [];
        }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          return <Item template={'project'} data={{item: item}} />;
        }}
      />
    </View>
  );
};
