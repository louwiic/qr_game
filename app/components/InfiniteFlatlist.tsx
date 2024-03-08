import {useQuery} from '@apollo/client';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {globalStyles} from '../GlobalStyle';
import {ViewWithLoading} from './ViewWithLoading';

const LIMIT = 9;

export const InfiniteFlatList = props => {
  const {responseQuery, query} = props;
  const {colors} = useTheme();
  const [pages, setPages] = React.useState([]);
  const [offset, setOffset] = React.useState(0);
  const {data, refetch, loading} = useQuery(query, {
    variables: {
      ...props.params,
      offset: offset,
      limit: LIMIT,
    },
  });

  const hasNextPage = React.useMemo(() => {
    return responseQuery(data)?.length >= LIMIT - 1;
  }, [data]);

  React.useEffect(() => {
    if (data) {
      if (offset === 0) {
        setPages([data]);
      } else {
        setPages([...pages, data]);
      }
    }
  }, [data]);

  const dataFormatted = React.useMemo(() => {
    return pages
      ?.map(page => {
        return responseQuery(page);
      })
      .flat();
  }, [pages]);

  const next = React.useCallback(() => {
    setOffset((pages.length || 0) * LIMIT);
  }, [pages]);

  return React.useMemo(
    () => (
      <ViewWithLoading
        isLoading={loading && (pages?.length || 0) < 0}
        textLoading={'Veuillez patientez...'}
        style={{
          flex: 1,
        }}>
        <FlatList
          {...props}
          contentContainerStyle={{
            marginHorizontal: globalStyles.margin_large,
          }}
          refreshControl={
            <RefreshControl
              tintColor={colors.btnBg}
              colors={[colors.btnBg]}
              progressBackgroundColor={colors.backgroundColor}
              refreshing={dataFormatted?.length === 0 && !loading}
              onRefresh={() => {
                setOffset(0);
                refetch();
              }}
            />
          }
          style={[
            props.style,
            {
              flex: 1,
            },
          ]}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={dataFormatted}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}>
                <Text
                  style={[
                    globalStyles.regular,
                    {
                      margin: globalStyles.margin_large,
                      textAlign: 'center',
                      color: colors.btnBg,
                    },
                  ]}>
                  {!loading && dataFormatted?.length === 0
                    ? props.textEmpty || ''
                    : ''}
                </Text>
              </View>
            );
          }}
          onEndReachedCalledDuringMomentum={false}
          ItemSeparatorComponent={() =>
            props.separator || (
              <View
                style={{
                  width: '100%',
                  height: globalStyles.margin_large,
                }}
              />
            )
          }
          ListFooterComponent={() => {
            return (
              <View style={{height: hasNextPage ? 50 : 30, flex: 1}}>
                {hasNextPage && (
                  <ActivityIndicator
                    color={colors.btnBg}
                    style={{
                      margin: globalStyles.margin_large,
                      alignSelf: 'center',
                    }}
                  />
                )}
              </View>
            );
          }}
          onEndReachedThreshold={0.01}
          onEndReached={() => {
            if (!loading && hasNextPage) {
              next();
            }
          }}
        />
      </ViewWithLoading>
    ),
    [pages, loading, hasNextPage],
  );
};
