import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {globalStyles} from '../GlobalStyle';
import {Item} from './Item';

export const Section = props => {
  const item = props.item;
  const temp = props.item?.template;
  const {colors} = useTheme();
  const styles = StyleSheet.create({
    hLayout: {
      flexDirection: 'row',
      marginTop: globalStyles.margin,
      marginBottom: globalStyles.margin,
    },
  });

  const wrapperStyle =
    item.column > 1
      ? {
          columnWrapperStyle: {
            justifyContent: 'space-between',
          },
        }
      : {};
  return (
    <View
      key={item.id}
      style={[{overflow: 'visible', marginTop: globalStyles.margin}]}>
      <View
        style={[
          styles.hLayout,
          props.style,
          {
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'visible',
            display: !item.disableSection ? null : 'none',
          },
        ]}>
        <Text
          style={[
            globalStyles.regular,
            {
              flex: 1,
              color: colors.black,
              fontSize: 18,
              lineHeight: 24,
              display: item.title ? null : 'none',
            },
          ]}>
          {item.title}
        </Text>

        <TouchableOpacity onPress={item.buttonPress}>
          <Text
            style={[
              globalStyles.medium,
              {
                paddingHorizontal: 0,
                color: '#FBB605',
                fontSize: 12,
                textDecorationLine: 'underline',
              },
            ]}>
            {item.buttonTitle || ''}
          </Text>
        </TouchableOpacity>
      </View>
      {item.items && (
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          {...wrapperStyle}
          ItemSeparatorComponent={() => {
            return props.separator || <View style={{width: 8, height: 8}} />;
          }}
          contentContainerStyle={[{overflow: 'visible'}]}
          key={item.title + '#' + (item.column || 1)}
          data={item.items}
          style={[props.style, {overflow: 'visible'}]}
          numColumns={item.column || 1}
          horizontal={item.orientation === 'horizontal'}
          keyExtractor={(i, index) => props.item.template + index.toString()}
          renderItem={data => (
            <Item data={data} navigation={props.navigation} template={temp} />
          )}
        />
      )}
    </View>
  );
};
