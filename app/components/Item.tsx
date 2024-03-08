import React from 'react';
import {View} from 'react-native';
import {CharacterItem} from './items/CharacterItem';
import {EpisodeItem} from './items/EpisodeItem';
import {MessageItem} from './items/MessageItem';
import {PostItem} from './items/PostItem';
import {ProjectItem} from './items/ProjectItem';

export const Item = props => {
  const item = props?.data?.item;
  switch (props?.template || item?.template) {
    case 'character':
      return <CharacterItem item={item} />;
    case 'episode':
      return <EpisodeItem item={item} />;
    case 'project':
      return <ProjectItem item={item} />;
    case 'project_mini':
      return <ProjectItem item={item} mini />;
    case 'post':
      return <PostItem item={item} />;
    case 'message':
      return <MessageItem item={item} />;
  }

  return <View />;
};
